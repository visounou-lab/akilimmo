import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { products } from "@/lib/products";
import { BorealMark, Wordmark } from "./logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tp = useTranslations("products.items");
  const tn = useTranslations("nav");
  const tl = useTranslations("pages");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-secondary/40">
      <div className="container-boreal py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BorealMark />
              <Wordmark />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t("tagline")}</p>
            <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {t("market")}
              </span>
              <span>{t("operator")}</span>
            </div>
          </div>

          <FooterCol title={t("columns.products")}>
            {products.map((p) => (
              <FooterLink key={p.key} href={`/financements#${p.key}`}>
                {tp(`${p.key}.title`)}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t("columns.company")}>
            <FooterLink href="/a-propos">{tn("about")}</FooterLink>
            <FooterLink href="/comment-ca-fonctionne">
              {tn("howItWorks")}
            </FooterLink>
            <FooterLink href="/faq">{tn("faq")}</FooterLink>
            <FooterLink href="/contact">{tn("contact")}</FooterLink>
          </FooterCol>

          <FooterCol title={t("columns.legal")}>
            <FooterLink href="/mentions-legales">
              {tl("legal.title")}
            </FooterLink>
            <FooterLink href="/confidentialite">
              {tl("privacy.title")}
            </FooterLink>
            <FooterLink href="/reclamations">
              {tl("complaints.title")}
            </FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 space-y-3 border-t pt-6 text-xs text-muted-foreground">
          <p>{t("rateNote")}</p>
          <p>{t("legalPlaceholder")}</p>
          <p className="pt-2">
            © {year} Boreal Finance Group. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-serif text-sm font-semibold text-foreground">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {children}
      </Link>
    </li>
  );
}
