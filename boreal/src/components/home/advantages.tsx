import { useTranslations } from "next-intl";
import { Eye, Languages, Lock, HeartHandshake } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";

const ITEMS = [
  { key: "a1", icon: Eye },
  { key: "a2", icon: Languages },
  { key: "a3", icon: Lock },
  { key: "a4", icon: HeartHandshake },
] as const;

export function Advantages() {
  const t = useTranslations("home.advantages");

  return (
    <section className="container-boreal py-20">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex gap-4 rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-aurora/15 text-aurora-foreground dark:text-aurora">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t(`items.${item.key}.text`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
