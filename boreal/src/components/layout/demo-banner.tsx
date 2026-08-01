import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

/**
 * Persistent "Environnement de démonstration" banner.
 * Business rule: it stays visible until the project goes to production.
 */
export function DemoBanner() {
  const t = useTranslations("demoBanner");
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container-boreal flex items-center gap-3 py-2 text-xs sm:text-[0.8rem]">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-aurora/20 px-2 py-0.5 font-medium text-aurora">
          <Info className="size-3.5" />
          {t("label")}
        </span>
        <p className="min-w-0 truncate text-primary-foreground/85 sm:whitespace-normal">
          {t("text")}
        </p>
      </div>
    </div>
  );
}
