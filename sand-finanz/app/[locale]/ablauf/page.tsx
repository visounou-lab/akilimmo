import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { href } from "@/lib/nav";
import { Section, PageHeader } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("ablauf.title") };
}

export default async function AblaufPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);
  const steps = [1, 2, 3];

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("ablauf.title")} subtitle={t("ablauf.subtitle")} />

      <ol style={{ marginTop: "2.5rem", display: "grid", gap: "1.25rem", listStyle: "none", padding: 0 }}>
        {steps.map((n) => (
          <li key={n} className="sand-card" style={{ padding: "1.6rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ flex: "0 0 auto", width: "48px", height: "48px", borderRadius: "14px", background: "var(--color-sand-navy)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.25rem" }}>{n}</span>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>{t(`ablauf.step${n}Title`)}</h2>
              <p style={{ marginTop: "0.5rem", color: "var(--color-sand-muted)", lineHeight: 1.6 }}>{t(`ablauf.step${n}Text`)}</p>
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link href={href(rl, "antrag")} className="sand-btn sand-btn-primary">{t("common.requestFinancing")}</Link>
        <Link href={href(rl, "unterlagen")} className="sand-btn sand-btn-ghost">{t("unterlagen.title")}</Link>
      </div>
    </Section>
  );
}
