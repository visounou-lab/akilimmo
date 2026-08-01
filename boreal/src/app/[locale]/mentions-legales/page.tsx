import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.legal" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent />;
}

function LegalContent() {
  const t = useTranslations("pages.legal");
  const sections = [
    { title: t("editorTitle"), text: t("editor") },
    { title: t("registrationTitle"), text: t("registration") },
    { title: t("hostingTitle"), text: t("hosting") },
    { title: t("domainTitle"), text: t("domain") },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </section>
          ))}
          <div className="flex items-start gap-3 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-glacier" />
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
