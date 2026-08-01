import { useTranslations } from "next-intl";
import { Calculator, FileText, Search, CheckCircle2 } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  { key: "s1", icon: Calculator },
  { key: "s2", icon: FileText },
  { key: "s3", icon: Search },
  { key: "s4", icon: CheckCircle2 },
] as const;

export function Process() {
  const t = useTranslations("home.process");

  return (
    <section className="border-y bg-secondary/30 py-20">
      <div className="container-boreal">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.key} className="relative">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-serif text-3xl font-semibold text-muted-foreground/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`steps.${step.key}.text`)}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
