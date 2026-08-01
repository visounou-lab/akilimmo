import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Calculator, FileText, Search, CheckCircle2, Info } from "lucide-react";

import { PageHeader } from "@/components/page-header";

const STEPS = [
  { key: "s1", icon: Calculator },
  { key: "s2", icon: FileText },
  { key: "s3", icon: Search },
  { key: "s4", icon: CheckCircle2 },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.howItWorks" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HowItWorksContent />;
}

function HowItWorksContent() {
  const t = useTranslations("pages.howItWorks");
  const ts = useTranslations("home.process.steps");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <ol className="mx-auto max-w-3xl space-y-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const last = index === STEPS.length - 1;
            return (
              <li key={step.key} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  {!last && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-2">
                  <span className="text-sm font-semibold text-glacier">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-xl font-semibold">
                    {ts(`${step.key}.title`)}
                  </h2>
                  <p className="mt-1.5 text-muted-foreground">
                    {ts(`${step.key}.text`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-glacier" />
          <p>{t("note")}</p>
        </div>
      </div>
    </>
  );
}
