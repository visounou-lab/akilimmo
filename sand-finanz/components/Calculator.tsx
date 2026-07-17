"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RouteLocale } from "@/lib/i18n/config";
import { localeConfig } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";
import { href } from "@/lib/nav";
import {
  calculate,
  formatMoney,
  formatPercent,
  getCatalog,
  validate,
  type CreditProductVersion,
} from "@/lib/credit-engine";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Calculator({
  locale,
  compact = false,
}: {
  locale: RouteLocale;
  compact?: boolean;
}) {
  const t = getTranslator(locale);
  const bcp47 = localeConfig[locale].bcp47;
  const catalog = getCatalog();

  const [productId, setProductId] = useState(catalog[0].id);
  const product = useMemo<CreditProductVersion>(
    () => catalog.find((p) => p.id === productId) ?? catalog[0],
    [catalog, productId],
  );

  const [amount, setAmount] = useState(() =>
    Math.round((product.minAmount + product.maxAmount) / 2 / 500) * 500,
  );
  const [term, setTerm] = useState(() => Math.round((product.minTerm + product.maxTerm) / 2));
  const [showSchedule, setShowSchedule] = useState(false);

  // Keep inputs within the selected product's bounds.
  const boundedAmount = clamp(amount, product.minAmount, product.maxAmount);
  const boundedTerm = clamp(term, product.minTerm, product.maxTerm);

  const result = useMemo(() => {
    const errors = validate({ principal: boundedAmount, termMonths: boundedTerm }, product);
    if (errors.length > 0) return null;
    return calculate({ principal: boundedAmount, termMonths: boundedTerm }, product);
  }, [boundedAmount, boundedTerm, product]);

  function onProductChange(id: string) {
    setProductId(id);
    const p = catalog.find((c) => c.id === id) ?? catalog[0];
    setAmount((a) => clamp(a, p.minAmount, p.maxAmount));
    setTerm((tm) => clamp(tm, p.minTerm, p.maxTerm));
  }

  const money = (n: number) => formatMoney(n, product.currency, bcp47);
  const applyHref = `${href(locale, "antrag")}?product=${product.productType}&amount=${boundedAmount}&term=${boundedTerm}`;

  return (
    <div className="sand-card" style={{ padding: compact ? "1.25rem" : "1.75rem" }}>
      {!compact && (
        <p className="sand-eyebrow" style={{ marginBottom: "0.5rem" }}>
          {t("calculator.quickTitle")}
        </p>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {/* Product */}
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("calculator.product")}</span>
          <select
            className="sand-field"
            value={productId}
            onChange={(e) => onProductChange(e.target.value)}
          >
            {catalog.map((p) => (
              <option key={p.id} value={p.id}>
                {t(`home.solutions.${p.productType}Title`)}
              </option>
            ))}
          </select>
        </label>

        {/* Amount */}
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("calculator.amount")}</span>
            <strong style={{ color: "var(--color-sand-navy)" }}>{money(boundedAmount)}</strong>
          </div>
          <input
            type="range"
            min={product.minAmount}
            max={product.maxAmount}
            step={500}
            value={boundedAmount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label={t("calculator.amount")}
            style={{ accentColor: "var(--color-sand-cta)" }}
          />
          <span style={{ fontSize: "0.75rem", color: "var(--color-sand-muted)" }}>
            {t("calculator.rangeHint")}: {money(product.minAmount)} – {money(product.maxAmount)}
          </span>
        </div>

        {/* Term */}
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("calculator.term")}</span>
            <strong style={{ color: "var(--color-sand-navy)" }}>
              {boundedTerm} {t("calculator.months")}
            </strong>
          </div>
          <input
            type="range"
            min={product.minTerm}
            max={product.maxTerm}
            step={1}
            value={boundedTerm}
            onChange={(e) => setTerm(Number(e.target.value))}
            aria-label={t("calculator.term")}
            style={{ accentColor: "var(--color-sand-cta)" }}
          />
          <span style={{ fontSize: "0.75rem", color: "var(--color-sand-muted)" }}>
            {t("calculator.rangeHint")}: {product.minTerm} – {product.maxTerm} {t("calculator.months")}
          </span>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem 1.1rem",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--color-sand-navy), var(--color-sand-navy-700))",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ opacity: 0.85, fontSize: "0.85rem" }}>{t("calculator.monthlyPayment")}</span>
            <strong style={{ fontSize: "1.6rem" }}>{money(result.monthlyPayment)}</strong>
          </div>
          {!compact && (
            <dl
              style={{
                marginTop: "0.9rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem 1rem",
                fontSize: "0.85rem",
              }}
            >
              <Row label={t("calculator.nominalRate")} value={formatPercent(result.nominalRate, bcp47)} />
              <Row
                label={`${t("calculator.effectiveRate")}${result.effectiveRateIsIndicative ? ` (${t("calculator.effectiveRateIndicative")})` : ""}`}
                value={formatPercent(result.effectiveRate, bcp47)}
              />
              <Row label={t("calculator.totalInterest")} value={money(result.totalInterest)} />
              {result.originationFee > 0 && (
                <Row label={t("calculator.originationFee")} value={money(result.originationFee)} />
              )}
              <Row label={t("calculator.totalRepayment")} value={money(result.totalRepayment)} />
              <Row label={t("calculator.totalCost")} value={money(result.totalCost)} strong />
            </dl>
          )}
        </div>
      )}

      {/* Schedule */}
      {!compact && result && (
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="sand-btn sand-btn-ghost"
            onClick={() => setShowSchedule((v) => !v)}
            aria-expanded={showSchedule}
            style={{ fontSize: "0.85rem" }}
          >
            {showSchedule ? t("calculator.hideSchedule") : t("calculator.showSchedule")}
          </button>
          {showSchedule && (
            <div style={{ marginTop: "0.8rem", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: "460px" }}>
                <thead>
                  <tr style={{ textAlign: "right", color: "var(--color-sand-muted)" }}>
                    <th style={{ textAlign: "left", padding: "0.4rem" }}>{t("calculator.scheduleMonth")}</th>
                    <th style={{ padding: "0.4rem" }}>{t("calculator.schedulePayment")}</th>
                    <th style={{ padding: "0.4rem" }}>{t("calculator.scheduleInterest")}</th>
                    <th style={{ padding: "0.4rem" }}>{t("calculator.schedulePrincipal")}</th>
                    <th style={{ padding: "0.4rem" }}>{t("calculator.scheduleBalance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} style={{ textAlign: "right", borderTop: "1px solid var(--color-sand-border)" }}>
                      <td style={{ textAlign: "left", padding: "0.4rem" }}>{row.month}</td>
                      <td style={{ padding: "0.4rem" }}>{money(row.payment)}</td>
                      <td style={{ padding: "0.4rem" }}>{money(row.interest)}</td>
                      <td style={{ padding: "0.4rem" }}>{money(row.principal)}</td>
                      <td style={{ padding: "0.4rem" }}>{money(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: "1.1rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        <Link href={applyHref} className="sand-btn sand-btn-primary" style={{ flex: compact ? "1 1 auto" : "0 0 auto" }}>
          {compact ? t("common.requestFinancing") : t("calculator.apply")}
        </Link>
      </div>

      <p style={{ marginTop: "0.9rem", fontSize: "0.75rem", color: "var(--color-sand-muted)", lineHeight: 1.5 }}>
        {t("calculator.disclaimer")}
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <>
      <dt style={{ opacity: 0.85 }}>{label}</dt>
      <dd style={{ textAlign: "right", fontWeight: strong ? 700 : 500 }}>{value}</dd>
    </>
  );
}
