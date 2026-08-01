import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Check, Info } from "lucide-react";

import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("pages.about");
  const values = ["v1", "v2", "v3"] as const;

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-lg text-muted-foreground">{t("intro")}</p>

          <div>
            <h2 className="font-serif text-2xl font-semibold">
              {t("missionTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("mission")}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold">
              {t("valuesTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-aurora/15 text-aurora-foreground dark:text-aurora">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-muted-foreground">
                    {t(`values.${v}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-glacier" />
            <p>{t("legalNote")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
