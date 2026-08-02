"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { computeSimulation, buildSchedule } from "@/lib/finance";
import { products, getProduct } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  variant?: "quick" | "full";
  defaultProduct?: string;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function FinancingSimulator({
  variant = "full",
  defaultProduct = "personal",
  className,
}: Props) {
  const t = useTranslations("simulator");
  const tp = useTranslations("products.items");
  const tQuick = useTranslations("home.quickSim");
  const locale = useLocale();

  const [productKey, setProductKey] = useState(defaultProduct);
  const product = getProduct(productKey) ?? products[0]!;

  const [amount, setAmount] = useState(() =>
    Math.round((product.minAmount + product.maxAmount) / 4),
  );
  const [months, setMonths] = useState(() =>
    Math.round((product.minMonths + product.maxMonths) / 2),
  );
  const [showSchedule, setShowSchedule] = useState(false);

  function onProductChange(key: string) {
    const next = getProduct(key);
    if (!next) return;
    setProductKey(key);
    setAmount((a) => clamp(a, next.minAmount, next.maxAmount));
    setMonths((m) => clamp(m, next.minMonths, next.maxMonths));
  }

  const rate = product.fromRate;

  const result = useMemo(
    () => computeSimulation({ amount, months, annualRate: rate }),
    [amount, months, rate],
  );

  const schedule = useMemo(
    () =>
      showSchedule ? buildSchedule({ amount, months, annualRate: rate }) : [],
    [showSchedule, amount, months, rate],
  );

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const durationLabel = [
    years > 0 ? t("fields.years", { count: years }) : null,
    remMonths > 0 ? t("fields.months", { count: remMonths }) : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-[var(--shadow-lift)] sm:p-6",
        className,
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {variant === "full" && (
            <div className="space-y-2">
              <Label htmlFor="sim-product">{t("fields.product")}</Label>
              <Select value={productKey} onValueChange={onProductChange}>
                <SelectTrigger id="sim-product">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.key} value={p.key}>
                      {tp(`${p.key}.title`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Field
            label={t("fields.amount")}
            value={formatCurrency(amount, locale)}
          >
            <Slider
              value={[amount]}
              min={product.minAmount}
              max={product.maxAmount}
              step={500}
              onValueChange={([v]) => setAmount(v ?? product.minAmount)}
              aria-label={t("fields.amount")}
            />
            <Bounds
              min={formatCurrency(product.minAmount, locale)}
              max={formatCurrency(product.maxAmount, locale)}
            />
          </Field>

          <Field label={t("fields.duration")} value={durationLabel}>
            <Slider
              value={[months]}
              min={product.minMonths}
              max={product.maxMonths}
              step={1}
              onValueChange={([v]) => setMonths(v ?? product.minMonths)}
              aria-label={t("fields.duration")}
            />
            <Bounds
              min={t("fields.months", { count: product.minMonths })}
              max={t("fields.months", { count: product.maxMonths })}
            />
          </Field>
        </div>

        {/* Results */}
        <div className="flex flex-col rounded-xl bg-primary p-5 text-primary-foreground sm:p-6">
          <span className="text-sm text-primary-foreground/75">
            {t("results.monthly")}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
              {formatCurrency(result.monthlyPayment, locale)}
            </span>
            <span className="text-sm text-primary-foreground/75">
              {t("results.perMonth")}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-primary-foreground/70">
            {t("noOffer")}
          </p>

          <dl className="mt-6 space-y-3 border-t border-primary-foreground/15 pt-5 text-sm">
            <Row
              label={t("results.rateApplied")}
              value={formatPercent(rate, locale)}
            />
            <Row
              label={t("results.totalPaid")}
              value={formatCurrency(result.totalPaid, locale)}
            />
            <Row
              label={t("results.interest")}
              value={formatCurrency(result.totalInterest, locale)}
            />
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            {variant === "quick" ? (
              <Button asChild variant="aurora" className="w-full">
                <Link href="/simulateur">
                  {tQuick("cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="aurora" className="w-full">
                <Link href="/contact">
                  {t("cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {variant === "full" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowSchedule((s) => !s)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            aria-expanded={showSchedule}
          >
            {showSchedule ? t("schedule.toggleHide") : t("schedule.toggleShow")}
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                showSchedule && "rotate-180",
              )}
            />
          </button>

          {showSchedule && (
            <div className="mt-4 overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <caption className="sr-only">{t("schedule.title")}</caption>
                <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
                  <tr>
                    <Th>{t("schedule.period")}</Th>
                    <Th className="text-right">{t("schedule.payment")}</Th>
                    <Th className="text-right">{t("schedule.principal")}</Th>
                    <Th className="text-right">{t("schedule.interest")}</Th>
                    <Th className="text-right">{t("schedule.balance")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {schedule.slice(0, 12).map((row) => (
                    <tr key={row.period} className="tabular-nums">
                      <Td>{row.period}</Td>
                      <Td className="text-right">
                        {formatCurrency(row.payment, locale)}
                      </Td>
                      <Td className="text-right">
                        {formatCurrency(row.principal, locale)}
                      </Td>
                      <Td className="text-right text-muted-foreground">
                        {formatCurrency(row.interest, locale)}
                      </Td>
                      <Td className="text-right">
                        {formatCurrency(row.balance, locale)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schedule.length > 12 && (
                <p className="border-t bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
                  {t("schedule.more", { count: schedule.length - 12 })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {t("disclaimer")}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        <span className="font-serif text-lg font-semibold tabular-nums">
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}

function Bounds({ min, max }: { min: string; max: string }) {
  return (
    <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-primary-foreground/75">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-3 py-2.5 font-medium", className)}>{children}</th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-3 py-2.5", className)}>{children}</td>;
}
