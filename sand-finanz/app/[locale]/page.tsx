import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, localeConfig } from "@/lib/i18n/config";
import { href } from "@/lib/nav";
import { Calculator } from "@/components/Calculator";
import { Section, SectionHeading } from "@/components/ui";
import { getPublishedCatalog } from "@/lib/catalog-server";

const SOLUTION_KEYS = ["personal", "auto", "renovation", "business", "study", "energy"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const t = getTranslator(locale);
  const catalog = await getPublishedCatalog();
  const minAmount = Math.min(...catalog.map((c) => c.minAmount));
  const maxTerm = Math.max(...catalog.map((c) => c.maxTerm));

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(180deg, #eef3fc 0%, var(--color-sand-bg) 100%)" }}>
        <div
          className="sand-container sand-hero-grid"
          style={{
            gap: "2.5rem",
            alignItems: "center",
            paddingBlock: "clamp(2.5rem, 6vw, 4.5rem)",
          }}
        >
          <div>
            <p className="sand-eyebrow">{t("home.hero.eyebrow")}</p>
            <h1 style={{ marginTop: "0.75rem", fontSize: "clamp(2.1rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--color-sand-navy)" }}>
              {t("home.hero.title")}
            </h1>
            <p style={{ marginTop: "1.1rem", fontSize: "1.15rem", color: "var(--color-sand-muted)", lineHeight: 1.6, maxWidth: "52ch" }}>
              {t("home.hero.subtitle")}
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link href={href(locale, "antrag")} className="sand-btn sand-btn-primary">{t("common.requestFinancing")}</Link>
              <Link href={href(locale, "leistungen")} className="sand-btn sand-btn-ghost">{t("common.discoverSolutions")}</Link>
            </div>
            <ul style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", listStyle: "none", padding: 0 }}>
              {["guarantee1", "guarantee2", "guarantee3"].map((g) => (
                <li key={g} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>
                  <span aria-hidden="true" style={{ color: "var(--color-sand-cta)" }}>✓</span>
                  {t(`home.hero.${g}`)}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "var(--color-sand-muted)", background: "#fff", border: "1px solid var(--color-sand-border)", borderRadius: "10px", padding: "0.7rem 0.9rem", maxWidth: "52ch" }}>
              {t("home.hero.warning")}
            </p>
          </div>
          <div id="quick-calculator">
            <Calculator locale={locale} catalog={catalog} compact />
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Stat value={`${minAmount.toLocaleString(localeToBcp(locale))} €`} label={t("home.stats.minAmount")} />
          <Stat value={`${maxTerm} ${t("home.stats.months")}`} label={t("home.stats.maxTerm")} />
          <Stat value={t("home.stats.decisionValue")} label={t("home.stats.decision")} small />
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--color-sand-muted)" }}>{t("home.stats.note")}</p>
      </Section>

      {/* Solutions */}
      <Section muted>
        <SectionHeading title={t("home.solutions.title")} subtitle={t("home.solutions.subtitle")} />
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {SOLUTION_KEYS.map((key, i) => (
            <div key={key} className="sand-card" style={{ padding: "1.4rem" }}>
              <div aria-hidden="true" style={{ width: "44px", height: "44px", borderRadius: "12px", background: `hsl(${215 + i * 12} 70% 96%)`, color: "var(--color-sand-cta)", display: "grid", placeItems: "center", fontWeight: 800 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ marginTop: "1rem", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>
                {t(`home.solutions.${key}Title`)}
              </h3>
              <p style={{ marginTop: "0.5rem", color: "var(--color-sand-muted)", fontSize: "0.92rem", lineHeight: 1.55 }}>
                {t(`home.solutions.${key}Text`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Advantages */}
      <Section>
        <SectionHeading title={t("home.advantages.title")} />
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ padding: "0.5rem" }}>
              <div aria-hidden="true" style={{ fontSize: "1.5rem" }}>{["🌐", "📄", "🤝", "🔒"][n - 1]}</div>
              <h3 style={{ marginTop: "0.6rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>{t(`home.advantages.item${n}Title`)}</h3>
              <p style={{ marginTop: "0.35rem", color: "var(--color-sand-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{t(`home.advantages.item${n}Text`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Full calculator */}
      <Section muted id="rechner">
        <div className="sand-split-grid" style={{ gap: "2rem", alignItems: "start" }}>
          <SectionHeading title={t("kreditrechner.title")} subtitle={t("kreditrechner.subtitle")} />
          <Calculator locale={locale} catalog={catalog} />
        </div>
      </Section>

      {/* Process teaser */}
      <Section>
        <SectionHeading title={t("home.processTeaser.title")} />
        <ol style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", listStyle: "none", padding: 0, counterReset: "step" }}>
          {["step1", "step2", "step3"].map((s, i) => (
            <li key={s} className="sand-card" style={{ padding: "1.4rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ flex: "0 0 auto", width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-sand-navy)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontWeight: 600, color: "var(--color-sand-navy)" }}>{t(`home.processTeaser.${s}`)}</span>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href={href(locale, "ablauf")} className="sand-btn sand-btn-ghost">{t("common.learnMore")}</Link>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div style={{ borderRadius: "24px", background: "linear-gradient(135deg, var(--color-sand-navy), var(--color-sand-cta))", color: "#fff", padding: "clamp(2rem, 5vw, 3.5rem)", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", fontWeight: 800 }}>{t("home.ctaFinal.title")}</h2>
          <p style={{ marginTop: "0.9rem", opacity: 0.9, maxWidth: "52ch", marginInline: "auto" }}>{t("home.ctaFinal.subtitle")}</p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href={href(locale, "antrag")} className="sand-btn" style={{ background: "#fff", color: "var(--color-sand-navy)" }}>
              {t("home.ctaFinal.button")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

function Stat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div className="sand-card" style={{ padding: "1.4rem" }}>
      <div style={{ fontSize: small ? "1.1rem" : "1.9rem", fontWeight: 800, color: "var(--color-sand-navy)", lineHeight: 1.2 }}>{value}</div>
      <div style={{ marginTop: "0.35rem", color: "var(--color-sand-muted)", fontSize: "0.9rem" }}>{label}</div>
    </div>
  );
}

function localeToBcp(locale: string): string {
  return isRouteLocale(locale) ? localeConfig[locale].bcp47 : "de-DE";
}
