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
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("pages.privacy");
  const sections = ["s1", "s2", "s3", "s4", "s5"] as const;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((s) => (
            <section key={s}>
              <h2 className="font-serif text-xl font-semibold">
                {t(`sections.${s}.title`)}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t(`sections.${s}.text`)}
              </p>
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
