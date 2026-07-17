import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { href } from "@/lib/nav";
import { Section, PageHeader, PlaceholderBadge } from "@/components/ui";

const SOLUTION_KEYS = ["personal", "auto", "renovation", "business", "study", "energy"] as const;

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

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("leistungen.title")} subtitle={t("leistungen.subtitle")} />
      <PlaceholderBadge text={t("leistungen.note")} />

      <div style={{ marginTop: "2.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {SOLUTION_KEYS.map((key, i) => (
          <div key={key} className="sand-card" style={{ padding: "1.6rem" }}>
            <div aria-hidden="true" style={{ width: "44px", height: "44px", borderRadius: "12px", background: `hsl(${215 + i * 12} 70% 96%)`, color: "var(--color-sand-cta)", display: "grid", placeItems: "center", fontWeight: 800 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h2 style={{ marginTop: "1rem", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>{t(`home.solutions.${key}Title`)}</h2>
            <p style={{ marginTop: "0.5rem", color: "var(--color-sand-muted)", lineHeight: 1.55 }}>{t(`home.solutions.${key}Text`)}</p>
            <div style={{ marginTop: "1.1rem" }}>
              <Link href={href(rl, "kreditrechner")} className="sand-btn sand-btn-ghost" style={{ fontSize: "0.85rem" }}>{t("nav.kreditrechner")}</Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <Link href={href(rl, "antrag")} className="sand-btn sand-btn-primary">{t("common.requestFinancing")}</Link>
      </div>
    </Section>
  );
}
