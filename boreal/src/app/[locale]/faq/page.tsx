import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/page-header";
import { FaqAccordion } from "@/components/faq-accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FaqContent />;
}

function FaqContent() {
  const t = useTranslations("pages.faq");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl rounded-xl border bg-card px-6 shadow-[var(--shadow-soft)]">
          <FaqAccordion />
        </div>
      </div>
    </>
  );
}
