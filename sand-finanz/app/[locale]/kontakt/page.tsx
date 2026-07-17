import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Section, PageHeader, PlaceholderBadge } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("kontakt.title") };
}

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);

  return (
    <Section>
      <PageHeader eyebrow={t("meta.siteName")} title={t("kontakt.title")} subtitle={t("kontakt.subtitle")} />
      <div style={{ marginTop: "2rem" }}>
        <ContactForm locale={rl} />
        <PlaceholderBadge text={t("kontakt.legalNote")} />
      </div>
    </Section>
  );
}
