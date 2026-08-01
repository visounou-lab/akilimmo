import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Clock, UserRound } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinancingSimulator } from "@/components/simulator/financing-simulator";

export function Hero() {
  const t = useTranslations("home.hero");
  const tr = useTranslations("home.rate");
  const tq = useTranslations("home.quickSim");

  const trust = [
    { icon: Clock, label: t("trust2") },
    { icon: ShieldCheck, label: t("trust1") },
    { icon: UserRound, label: t("trust3") },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="aurora-veil absolute inset-0 -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container-boreal grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Badge variant="aurora" className="mb-5">
            {t("eyebrow")}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="aurora">
              <Link href="/simulateur">
                {t("ctaPrimary")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/financements">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          {/* Rate highlight */}
          <div className="mt-10 flex items-start gap-4 rounded-xl border bg-card/60 p-4 backdrop-blur">
            <div className="rounded-lg bg-primary px-3 py-2 text-center text-primary-foreground">
              <div className="text-[0.65rem] uppercase tracking-wide text-primary-foreground/70">
                {tr("badge")}
              </div>
              <div className="font-serif text-xl font-semibold leading-tight">
                {tr("value")}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {tr("caption")}
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-glacier" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-semibold">{tq("title")}</h2>
            <span className="text-sm text-muted-foreground">
              {tq("subtitle")}
            </span>
          </div>
          <FinancingSimulator variant="quick" />
        </div>
      </div>
    </section>
  );
}
