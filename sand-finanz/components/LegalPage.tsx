import type { RouteLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";
import { Section, PageHeader, PlaceholderBadge } from "@/components/ui";

type LegalKey = "impressum" | "datenschutz" | "cookies" | "nutzungsbedingungen";

export function LegalPage({ locale, legalKey }: { locale: RouteLocale; legalKey: LegalKey }) {
  const t = getTranslator(locale);
  return (
    <Section>
      <PageHeader title={t(`legal.${legalKey}.title`)} />
      <div style={{ marginTop: "1.5rem", maxWidth: "72ch" }}>
        <p style={{ color: "var(--color-sand-ink)", lineHeight: 1.75 }}>{t(`legal.${legalKey}.body`)}</p>
        <PlaceholderBadge text={t("common.placeholderNotice")} />
      </div>
    </Section>
  );
}
