import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Calculator } from "@/components/Calculator";
import { Section, PageHeader } from "@/components/ui";
import { getPublishedCatalog } from "@/lib/catalog-server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("kreditrechner.title") };
}

export default async function KreditrechnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);
  const catalog = await getPublishedCatalog();

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("kreditrechner.title")} subtitle={t("kreditrechner.subtitle")} />
      <div style={{ marginTop: "2rem", maxWidth: "640px" }}>
        <Calculator locale={rl} catalog={catalog} />
      </div>
    </Section>
  );
}
