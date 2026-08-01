import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { products } from "@/lib/products";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.financing" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FinancingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FinancingContent />;
}

function FinancingContent() {
  const t = useTranslations("pages.financing");
  const tp = useTranslations("products.items");
  const locale = useLocale();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <article
                key={product.key}
                id={product.key}
                className="scroll-mt-28 rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-semibold">
                  {tp(`${product.key}.title`)}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {tp(`${product.key}.description`)}
                </p>

                <dl className="mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-sm">
                  <Detail
                    label={t("detailAmount")}
                    value={`${formatCurrency(product.minAmount, locale)} – ${formatCurrency(product.maxAmount, locale)}`}
                  />
                  <Detail
                    label={t("detailDuration")}
                    value={`${product.minMonths}–${product.maxMonths}`}
                  />
                  <Detail
                    label={t("detailRate")}
                    value={formatPercent(product.fromRate, locale)}
                  />
                </dl>

                <Button asChild variant="outline" className="mt-6">
                  <Link href="/simulateur">
                    {t("simulate")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium tabular-nums">{value}</dd>
    </div>
  );
}
