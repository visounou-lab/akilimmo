import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Section, PageHeader } from "@/components/ui";
import { ApplicationForm } from "@/components/ApplicationForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  // The application flow should not be indexed as marketing content.
  return { title: getTranslator(locale)("antrag.title"), robots: { index: false, follow: true } };
}

export default async function AntragPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);

  return (
    <Section>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <PageHeader eyebrow={t("meta.siteName")} title={t("antrag.title")} subtitle={t("antrag.subtitle")} />
      </div>
      <Suspense fallback={<div className="sand-card" style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>…</div>}>
        <ApplicationForm locale={rl} />
      </Suspense>
    </Section>
  );
}
