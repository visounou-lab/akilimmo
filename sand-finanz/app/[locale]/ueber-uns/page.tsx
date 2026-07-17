import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Section, PageHeader, PlaceholderBadge } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("ueberUns.title") };
}

export default async function UeberUnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("ueberUns.title")} subtitle={t("ueberUns.subtitle")} />

      <div style={{ marginTop: "2rem", maxWidth: "68ch", display: "grid", gap: "1.5rem" }}>
        <p style={{ color: "var(--color-sand-ink)", lineHeight: 1.7, fontSize: "1.05rem" }}>{t("ueberUns.body")}</p>
        <div className="sand-card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>{t("ueberUns.responsibleTitle")}</h2>
          <p style={{ marginTop: "0.6rem", color: "var(--color-sand-muted)", lineHeight: 1.6 }}>{t("ueberUns.responsibleText")}</p>
        </div>
        <PlaceholderBadge text={t("common.placeholderNotice")} />
      </div>
    </Section>
  );
}
