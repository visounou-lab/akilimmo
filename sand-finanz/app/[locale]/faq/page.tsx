import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getList, getTranslator } from "@/lib/i18n";
import { isRouteLocale, type RouteLocale } from "@/lib/i18n/config";
import { Section, PageHeader } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  return { title: getTranslator(locale)("faq.title") };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const rl = locale as RouteLocale;
  const t = getTranslator(rl);
  const items = getList(rl, "faq.items");

  // Structured data — only exact Q/A pairs, no invented claims.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow={t("meta.siteName")} title={t("faq.title")} subtitle={t("faq.subtitle")} />

      <div style={{ marginTop: "2rem", maxWidth: "760px", display: "grid", gap: "0.75rem" }}>
        {items.map((it, i) => (
          <details key={i} className="sand-card" style={{ padding: "1rem 1.25rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--color-sand-navy)", listStyle: "none", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              {it.q}
              <span aria-hidden="true" style={{ color: "var(--color-sand-cta)" }}>+</span>
            </summary>
            <p style={{ marginTop: "0.75rem", color: "var(--color-sand-muted)", lineHeight: 1.6 }}>{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
