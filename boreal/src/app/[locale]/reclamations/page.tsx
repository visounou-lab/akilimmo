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
  const t = await getTranslations({ locale, namespace: "pages.complaints" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ComplaintsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComplaintsContent />;
}

function ComplaintsContent() {
  const t = useTranslations("pages.complaints");
  const steps = ["s1", "s2", "s3", "s4"] as const;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <section>
            <h2 className="font-serif text-xl font-semibold">
              {t("processTitle")}
            </h2>
            <ol className="mt-4 space-y-4">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground">{t(`steps.${s}`)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold">
              {t("escalationTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("escalation")}</p>
          </section>

          <div className="flex items-start gap-3 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-glacier" />
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
