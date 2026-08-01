import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  const t = useTranslations("home.cta");

  return (
    <section className="container-boreal py-20">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
        <div className="aurora-veil absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="aurora">
              <Link href="/simulateur">
                {t("primary")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">{t("secondary")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
