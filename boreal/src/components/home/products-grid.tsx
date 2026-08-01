import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { products } from "@/lib/products";
import { formatPercent } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";

export function ProductsGrid() {
  const t = useTranslations("home.products");
  const tp = useTranslations("products.items");
  const locale = useLocale();

  return (
    <section className="container-boreal py-20">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <Link
              key={product.key}
              href={`/financements#${product.key}`}
              className="group relative flex flex-col rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-glacier/50 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:text-primary" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold">
                {tp(`${product.key}.title`)}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {tp(`${product.key}.description`)}
              </p>
              <div className="mt-5 inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {t("fromRate", { rate: formatPercent(product.fromRate, locale) })}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
