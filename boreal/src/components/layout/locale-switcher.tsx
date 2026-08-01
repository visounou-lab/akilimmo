"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      // @ts-expect-error -- params typing is route-dependent
      router.replace({ pathname, params }, { locale: next });
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-background/60 p-0.5 text-sm",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label={t("label")}
    >
      <Globe className="mx-1.5 size-4 text-muted-foreground" aria-hidden />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium uppercase transition-colors",
            loc === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
