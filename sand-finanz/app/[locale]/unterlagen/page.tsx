import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Section, PageHeader } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("unterlagen.title") };
}

export default async function UnterlagenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);
  const items = ["item1", "item2", "item3", "item4", "item5"];

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("unterlagen.title")} subtitle={t("unterlagen.subtitle")} />

      <ul style={{ marginTop: "2rem", display: "grid", gap: "0.75rem", listStyle: "none", padding: 0, maxWidth: "620px" }}>
        {items.map((it) => (
          <li key={it} className="sand-card" style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span aria-hidden="true" style={{ color: "var(--color-sand-cta)", fontWeight: 800 }}>✓</span>
            <span style={{ fontWeight: 500 }}>{t(`unterlagen.${it}`)}</span>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "1.75rem", maxWidth: "620px", fontSize: "0.9rem", color: "#8a5a00", background: "#fff5e6", border: "1px solid #ffd699", borderRadius: "12px", padding: "1rem 1.25rem", lineHeight: 1.6 }}>
        🔒 {t("unterlagen.securityNote")}
      </p>
    </Section>
  );
}
