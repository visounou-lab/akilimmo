import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldCheck } from "lucide-react";
import { SITE_URL, countryLabel } from "@/lib/share";
import { LAND_TITLE_LABELS, maskTitleRef, certificateRef } from "@/lib/land-title";
import CertificatActions from "../../../../components/v3/terrains/CertificatActions";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

const getLand = cache(async (slug: string) => prisma.land.findUnique({ where: { slug } }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const land = await getLand(slug);
  if (!land) return { title: "Certificat introuvable — AKIL IMMO" };
  return {
    title: `Certificat de vérification — ${land.title} | AKIL IMMO`,
    description: `Certificat de contrôle du titre de propriété du terrain « ${land.title} » à ${land.city}, émis par AKIL IMMO.`,
    robots: { index: false, follow: false },
  };
}

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(d);

export default async function CertificatPage({ params }: Props) {
  const { slug } = await params;
  const land = await getLand(slug);
  // Un certificat n'existe que pour un titre réellement vérifié.
  if (!land || land.titleVerification !== "VERIFIED") notFound();

  const ref        = certificateRef(land.id);
  const issuedAt   = land.titleVerifiedAt ? fmtDate(land.titleVerifiedAt) : "—";
  const cLabel     = countryLabel(land.country);
  const titleLabel = LAND_TITLE_LABELS[land.titleType] ?? land.titleType;
  const pageUrl    = `${SITE_URL}/terrains/${land.slug}/certificat`;
  const verifyPath = `akilimmo.com/terrains/${land.slug}`;

  const label: React.CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8A7B6B",
  };
  const value: React.CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "0.95rem",
    color: "#1C1917",
    fontWeight: 500,
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print { display: none !important; }
              body { background: #ffffff !important; }
              @page { margin: 1.4cm; }
            }
          `,
        }}
      />
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", padding: "2rem 0 3rem" }}>
        <CertificatActions pageUrl={pageUrl} terrainUrl={`/terrains/${land.slug}`} />

        {/* Certificat */}
        <article
          className="mx-auto"
          style={{
            maxWidth: 800,
            backgroundColor: "#FFFFFF",
            border: "2px solid #C8922A",
            borderRadius: 6,
            padding: "clamp(2rem, 5vw, 3.5rem)",
            boxShadow: "0 8px 40px rgba(28,25,23,0.10)",
          }}
        >
          {/* En-tête */}
          <div style={{ textAlign: "center", borderBottom: "1px solid #E8DDD0", paddingBottom: "1.75rem" }}>
            <div className="flex items-center justify-center gap-3" style={{ marginBottom: "1.25rem" }}>
              <span style={{ display: "block", width: 4, height: 26, backgroundColor: "#C8922A", borderRadius: 2 }} />
              <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.4rem", color: "#1C1917", letterSpacing: "0.06em" }}>
                AKIL IMMO
              </span>
            </div>
            <div
              className="mx-auto flex items-center justify-center rounded-full"
              style={{ width: 56, height: 56, backgroundColor: "#EAF3EF", border: "1px solid rgba(18,56,45,0.25)", marginBottom: "1rem" }}
            >
              <ShieldCheck size={28} style={{ color: "#12382D" }} aria-hidden="true" />
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.3rem, 3vw, 1.7rem)", color: "#1C1917", letterSpacing: "0.01em" }}>
              Certificat de vérification de titre
            </h1>
            <p className="mt-2" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#6B5E52" }}>
              Réf. {ref} · Émis le {issuedAt}
            </p>
          </div>

          {/* Attestation */}
          <p
            className="text-center"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.95rem", color: "#3D3530", lineHeight: 1.8, margin: "1.75rem auto", maxWidth: "56ch" }}
          >
            AKIL IMMO atteste avoir procédé au <strong>contrôle documentaire du titre de propriété</strong> du
            terrain désigné ci-dessous.
          </p>

          {/* Détails du terrain */}
          <div
            style={{ backgroundColor: "#FDFCF8", border: "1px solid #E8DDD0", borderRadius: 8, padding: "1.5rem 1.75rem" }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={label}>Désignation</p>
                <p style={value}>{land.title}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={label}>Localisation</p>
                <p style={value}>{land.address}, {land.city} — {cLabel}</p>
              </div>
              <div>
                <p style={label}>Superficie</p>
                <p style={value}>{new Intl.NumberFormat("fr-FR").format(land.surface)} m²</p>
              </div>
              <div>
                <p style={label}>Type de titre</p>
                <p style={value}>{titleLabel}</p>
              </div>
              {land.titleRef && (
                <div>
                  <p style={label}>Référence du titre</p>
                  <p style={{ ...value, fontVariantNumeric: "tabular-nums" }}>{maskTitleRef(land.titleRef)}</p>
                </div>
              )}
              <div>
                <p style={label}>Vérifié le</p>
                <p style={value}>{issuedAt}</p>
              </div>
            </div>
          </div>

          {/* Ce qui a été contrôlé */}
          {land.titleVerificationNote && (
            <div style={{ marginTop: "1.5rem" }}>
              <p style={label}>Contrôle effectué</p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#3D3530", lineHeight: 1.7, marginTop: 4 }}>
                {land.titleVerificationNote}
              </p>
            </div>
          )}

          {/* Portée / avertissement — honnêteté */}
          <p
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", color: "#8A7B6B", lineHeight: 1.65, marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid #E8DDD0" }}
          >
            Ce certificat atteste d&apos;un contrôle documentaire réalisé par AKIL IMMO à la date indiquée.
            Il ne constitue ni un acte de propriété, ni une garantie juridique définitive, et n&apos;engage pas
            la responsabilité d&apos;AKIL IMMO au-delà du contrôle effectué. Toute transaction reste soumise
            aux vérifications d&apos;usage auprès des autorités compétentes.
          </p>

          {/* Pied — authenticité */}
          <div
            className="flex items-end justify-between gap-4"
            style={{ marginTop: "2rem" }}
          >
            <div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "#8A7B6B", marginBottom: 4 }}>
                Authenticité vérifiable en ligne :
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "#1B4D3E", fontWeight: 600 }}>
                {verifyPath}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "0.95rem", color: "#C8922A", letterSpacing: "0.04em" }}>
                AKIL IMMO
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "#8A7B6B" }}>
                Service Vérification
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
