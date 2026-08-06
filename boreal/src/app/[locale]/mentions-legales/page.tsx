import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ExternalLink, ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import {
  IMPRESSUM_COMPANY as C,
  IMPRESSUM_AUTHORITIES,
  IMPRESSUM_PROSE as P,
} from "@/lib/legal/impressum";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.legal" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent />;
}

function LegalContent() {
  const t = useTranslations("pages.legal");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="text-xs uppercase tracking-wide text-glacier">Impressum</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">
              Rechtliche Hinweise
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("authoritativeNote")}
            </p>

            <div className="mt-8 space-y-8">
              <Section id="1" title="Angaben gemäß § 5 DDG">
                <p className="font-medium">{C.name}</p>
                {C.addressLines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </Section>

              <Section id="2" title="Unternehmensangaben">
                <Data label="Firma" value={C.name} />
                <Data label="Rechtsform" value="Aktiengesellschaft (AG)" />
              </Section>

              <Section id="3" title="Sitz der Gesellschaft">
                <p>{C.sitz}</p>
              </Section>

              <Section id="4" title="Handelsregister">
                <p>{C.handelsregister}</p>
              </Section>

              <Section id="5" title="Umsatzsteuer-Identifikationsnummer">
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a
                  Umsatzsteuergesetz:
                </p>
                <p className="font-medium">{C.ustId}</p>
              </Section>

              <Section id="6" title="Bank- und Registrierungsdaten">
                <Data label="Bankleitzahl (BLZ)" value={C.blz} />
                <Data label="GIIN" value={C.giin} />
              </Section>

              <Section id="7" title="Zuständige Aufsichtsbehörden">
                <p className="text-muted-foreground">
                  Zuständige Aufsichtsbehörden für Finanzdienstleistungen in
                  Deutschland:
                </p>
                <div className="mt-3 space-y-5">
                  {IMPRESSUM_AUTHORITIES.map((a) => (
                    <div key={a.name}>
                      <p className="font-medium">{a.name}</p>
                      {a.addressBlocks.map((block, i) => (
                        <div key={i} className="mt-1 text-muted-foreground">
                          {block.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      ))}
                      <a
                        href={a.website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {a.website.label}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="8" title="Haftung für Inhalte">
                <Prose paragraphs={P.liabilityContent} />
              </Section>

              <Section id="9" title="Haftung für externe Links">
                <Prose paragraphs={P.liabilityLinks} />
              </Section>

              <Section id="10" title="Urheberrecht">
                <Prose paragraphs={P.copyright} />
              </Section>

              <Section id="11" title="Online-Streitbeilegung">
                <Prose paragraphs={P.disputeResolution} />
              </Section>

              <Section id="12" title="Datenschutz">
                <Prose paragraphs={P.dataProtection} />
                <Link
                  href="/confidentialite"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {t("datenschutzLink")}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <h3 className="font-serif text-lg font-semibold">
        <span className="mr-2 text-muted-foreground/50 tabular-nums">{id}.</span>
        {title}
      </h3>
      <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium sm:text-right">{value}</span>
    </div>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          {p}
        </p>
      ))}
    </>
  );
}
