import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, localeConfig, type RouteLocale } from "@/lib/i18n/config";
import { href } from "@/lib/nav";
import { Section, PageHeader, PlaceholderBadge } from "@/components/ui";
import { getPublishedCatalog } from "@/lib/catalog-server";
import { formatPercent, type ProductType } from "@/lib/credit-engine";

const SOLUTION_KEYS: ProductType[] = ["personal", "auto", "renovation", "business", "study", "energy"];

// Original SAND accent per category (echoes a colourful line-up without copying any third party).
const ACCENTS: Record<ProductType, string> = {
  personal: "#2666eb",
  auto: "#18305f",
  renovation: "#15803d",
  business: "#5b3fd6",
  study: "#ea6a12",
  energy: "#0d9488",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("leistungen.title") };
}

export default async function LeistungenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);
  const bcp47 = localeConfig[rl].bcp47;
  const catalog = await getPublishedCatalog();
  const byType = new Map(catalog.map((c) => [c.productType, c]));

  const money = (n: number) =>
    new Intl.NumberFormat(bcp47, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("leistungen.title")} subtitle={t("leistungen.subtitle")} />
      <PlaceholderBadge text={t("leistungen.note")} />

      <div style={{ marginTop: "2.5rem", display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {SOLUTION_KEYS.map((key) => {
          const p = byType.get(key);
          const accent = ACCENTS[key];
          return (
            <div key={key} className="sand-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Coloured header band with rate badge */}
              <div style={{ background: accent, color: "#fff", padding: "1.25rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{t(`home.solutions.${key}Title`)}</h2>
                {p && (
                  <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "99px", padding: "0.25rem 0.7rem", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                    {formatPercent(p.nominalRate, bcp47)} {t("leistungen.fixedRate")}
                  </span>
                )}
              </div>

              <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                <p style={{ color: "var(--color-sand-muted)", lineHeight: 1.55, fontSize: "0.92rem" }}>
                  {t(`home.solutions.${key}Text`)}
                </p>

                {p && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ background: "var(--color-sand-bg)", borderRadius: "12px", padding: "0.75rem 0.9rem" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-sand-muted)", textTransform: "uppercase" }}>{t("leistungen.amountLabel")}</div>
                      <div style={{ fontWeight: 800, color: "var(--color-sand-navy)", marginTop: "0.2rem" }}>{money(p.minAmount)}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-sand-muted)" }}>{t("leistungen.to")} {money(p.maxAmount)}</div>
                    </div>
                    <div style={{ background: "var(--color-sand-bg)", borderRadius: "12px", padding: "0.75rem 0.9rem" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-sand-muted)", textTransform: "uppercase" }}>{t("leistungen.termLabel")}</div>
                      <div style={{ fontWeight: 800, color: "var(--color-sand-navy)", marginTop: "0.2rem" }}>{p.minTerm}–{p.maxTerm}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-sand-muted)" }}>{t("leistungen.months")}</div>
                    </div>
                  </div>
                )}

                <Link
                  href={`${href(rl, "antrag")}?product=${key}`}
                  className="sand-btn"
                  style={{ marginTop: "auto", background: accent, color: "#fff", justifyContent: "center" }}
                >
                  {t("leistungen.apply")} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href={href(rl, "kreditrechner")} className="sand-btn sand-btn-ghost">{t("nav.kreditrechner")}</Link>
      </div>
    </Section>
  );
}
