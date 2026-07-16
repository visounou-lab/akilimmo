import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "../../../components/v3/Navbar";
import Footer from "../../../components/v3/Footer";
import PropertyGallery from "../../../components/v3/biens/PropertyGallery";
import ContactCardV3 from "../../../components/v3/biens/ContactCardV3";
import TerrainInquiryForm from "../../../components/v3/terrains/TerrainInquiryForm";
import TrustBadge from "../../../components/v3/TrustBadge";
import { extractYouTubeId } from "@/lib/youtube";
import { SITE_URL, countryLabel } from "@/lib/share";
import { MapPin, Maximize, ShieldCheck, Plug } from "lucide-react";

// Masque partiellement la référence du titre : prouve qu'AKIL IMMO la détient
// sans exposer publiquement le numéro complet.
function maskTitleRef(ref: string): string {
  const trimmed = ref.trim();
  if (trimmed.length <= 4) return trimmed;
  const head = trimmed.slice(0, Math.min(4, trimmed.length - 2));
  return `${head}${"•".repeat(Math.max(2, trimmed.length - head.length - 1))}${trimmed.slice(-1)}`;
}

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

const TITLE_LABEL: Record<string, string> = {
  TITRE_FONCIER: "Titre foncier",
  ACD: "ACD (Attestation de Cession Définitive)",
  LETTRE_ATTRIBUTION: "Lettre d'attribution",
  CONVENTION_VENTE: "Convention de vente",
  AUTRE: "Autre",
};

const getLand = cache(async (slug: string) => {
  return prisma.land.findUnique({ where: { slug } });
});

export async function generateStaticParams() {
  const lands = await prisma.land.findMany({
    where: { publishStatus: "published" },
    select: { slug: true },
  });
  return lands.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = await getLand(slug);
  if (!l) return { title: "Terrain introuvable — AKIL IMMO" };

  const priceFmt = new Intl.NumberFormat("fr-FR").format(Number(l.price));
  const ogImage = l.images[0] ?? l.imageUrl ?? `${SITE_URL}/opengraph-image`;
  const description =
    l.description?.slice(0, 160) ||
    `${l.title} à ${l.city}, ${countryLabel(l.country)} — ${l.surface} m². Terrain à vendre sur AKIL IMMO.`;

  return {
    title: `${l.title} — ${priceFmt} XOF | AKIL IMMO`,
    description,
    openGraph: {
      title: l.title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: l.title }],
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function TerrainDetailPage({ params }: Props) {
  const { slug } = await params;
  const land = await getLand(slug);
  if (!land || land.publishStatus !== "published") notFound();

  const price = Number(land.price);
  const priceFmt = new Intl.NumberFormat("fr-FR").format(price);
  const surfaceFmt = new Intl.NumberFormat("fr-FR").format(land.surface);
  const titleVerified = land.titleVerification === "VERIFIED";
  const titleVerifiedAtFmt = land.titleVerifiedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(land.titleVerifiedAt)
    : null;
  const youtubeId = extractYouTubeId(land.videoUrl);
  const waNumber =
    land.country === "COTE_D_IVOIRE" ? "2250710259146" : "2290197598682";
  const phoneDisplay =
    land.country === "COTE_D_IVOIRE" ? "+225 07 10 25 91 46" : "+229 01 97 59 86 82";
  const cLabel = countryLabel(land.country);

  const galleryImages = land.images.map((url, i) => ({
    id: `${land.id}-${i}`,
    url,
    alt: land.title,
    order: i,
  }));

  const sectionTitle: React.CSSProperties = {
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#C8922A",
    marginBottom: 6,
  };

  const card: React.CSSProperties = {
    backgroundColor: "#FDFCF8",
    border: "1.5px solid rgba(200,146,42,0.35)",
    borderRadius: 16,
    padding: "1.5rem",
    boxShadow: "0 2px 12px rgba(28,25,23,0.06)",
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16" style={{ backgroundColor: "#FDFCF8" }}>
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="text-xs" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
            <a href="/" className="hover:underline">Accueil</a>
            <span className="mx-1.5">/</span>
            <a href="/terrains" className="hover:underline">Terrains</a>
            <span className="mx-1.5">/</span>
            <span style={{ color: "#1C1917" }}>{land.title}</span>
          </nav>
        </div>

        {/* Visite virtuelle */}
        {youtubeId && (
          <section className="py-10 lg:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center mb-6 text-xs font-medium tracking-widest uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A", letterSpacing: "0.14em" }}>
                VISITE VIRTUELLE
              </p>
              <div className="relative mx-auto overflow-hidden rounded-2xl"
                style={{ maxWidth: 1100, aspectRatio: "16 / 9", boxShadow: "0 8px 32px rgba(28,25,23,0.12)" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={`Visite virtuelle — ${land.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </section>
        )}

        {/* Galerie */}
        {galleryImages.length > 0 && <PropertyGallery images={galleryImages} />}

        {/* Section principale */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-8 lg:gap-12 items-start">
              {/* Colonne gauche */}
              <div className="space-y-10">
                {/* Titre + localisation */}
                <div>
                  <h1 style={{
                    fontFamily: "var(--font-playfair), serif", fontWeight: 700,
                    fontSize: "clamp(1.75rem, 4vw, 2.6rem)", color: "#1C1917",
                    letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "0.75rem",
                  }}>
                    {land.title}
                  </h1>
                  {land.titleVerification === "VERIFIED" && (
                    <div className="mb-4">
                      <TrustBadge kind="title-verified" />
                    </div>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${land.address}, ${land.city}, ${cLabel}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                    style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#6B5E52", width: "fit-content" }}
                  >
                    <MapPin size={14} aria-hidden="true" style={{ color: "#C8922A", flexShrink: 0 }} />
                    {land.address}, {land.city} — {cLabel}
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 py-4"
                  style={{ borderTop: "1px solid #E8DDD0", borderBottom: "1px solid #E8DDD0" }}>
                  <span className="flex items-center gap-2" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#1C1917" }}>
                    <Maximize size={16} aria-hidden="true" style={{ color: "#C8922A" }} />
                    <strong style={{ fontFamily: "var(--font-playfair), serif" }}>{surfaceFmt}</strong> m²
                  </span>
                  <span className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                    style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "rgba(200,146,42,0.1)", color: "#C8922A", border: "1px solid rgba(200,146,42,0.3)" }}>
                    <ShieldCheck size={13} aria-hidden="true" />
                    {TITLE_LABEL[land.titleType] ?? land.titleType}
                  </span>
                  {land.serviced && (
                    <span className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "rgba(27,77,62,0.08)", color: "#1B4D3E", border: "1px solid rgba(27,77,62,0.2)" }}>
                      <Plug size={13} aria-hidden="true" />
                      Viabilisé
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p style={sectionTitle}>DESCRIPTION</p>
                  <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.4rem", color: "#1C1917", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
                    À propos de ce terrain
                  </h2>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "#3D3530", lineHeight: 1.75, maxWidth: "65ch", whiteSpace: "pre-wrap" }}>
                    {land.description}
                  </p>
                </div>

                {/* Localisation */}
                <div>
                  <p style={sectionTitle}>LOCALISATION</p>
                  <div className="overflow-hidden rounded-2xl" style={{ border: "1.5px solid rgba(200,146,42,0.25)", aspectRatio: "16/9" }}>
                    <iframe
                      title={`Localisation — ${land.title}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${land.address}, ${land.city}, ${cLabel}`)}&output=embed&z=14`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>

              {/* Colonne droite (sticky) */}
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* Card prix */}
                <div style={card}>
                  <p style={sectionTitle}>PRIX DE VENTE</p>
                  <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#1C1917", lineHeight: 1, marginBottom: "0.25rem" }}>
                    {priceFmt}{" "}
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 400, fontSize: "0.875rem", color: "#6B5E52" }}>XOF</span>
                  </p>
                  <div className="mt-4 pt-4 flex items-center gap-2 text-sm"
                    style={{ borderTop: "1px solid rgba(200,146,42,0.2)", fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}>
                    <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "0.9rem", color: "#C8922A", letterSpacing: "0.06em" }}>
                      AKIL IMMO
                    </span>
                    — Statut juridique vérifié
                  </div>
                </div>

                {/* Panneau de confiance — vérification du titre */}
                {titleVerified ? (
                  <div
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: "#EAF3EF", border: "1.5px solid rgba(18,56,45,0.25)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={20} aria-hidden="true" style={{ color: "#12382D" }} />
                      <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.05rem", color: "#12382D" }}>
                        Titre vérifié par AKIL IMMO
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1C3A30" }}>
                      <li className="flex justify-between gap-3">
                        <span style={{ color: "#4B6157" }}>Type de titre</span>
                        <span style={{ fontWeight: 600 }}>{TITLE_LABEL[land.titleType] ?? land.titleType}</span>
                      </li>
                      {land.titleRef && (
                        <li className="flex justify-between gap-3">
                          <span style={{ color: "#4B6157" }}>Référence</span>
                          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{maskTitleRef(land.titleRef)}</span>
                        </li>
                      )}
                      {titleVerifiedAtFmt && (
                        <li className="flex justify-between gap-3">
                          <span style={{ color: "#4B6157" }}>Vérifié le</span>
                          <span style={{ fontWeight: 600 }}>{titleVerifiedAtFmt}</span>
                        </li>
                      )}
                    </ul>
                    {land.titleVerificationNote && (
                      <p className="mt-3 pt-3 text-sm" style={{ borderTop: "1px solid rgba(18,56,45,0.15)", color: "#1C3A30", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
                        {land.titleVerificationNote}
                      </p>
                    )}
                    <p className="mt-3 text-xs" style={{ color: "#4B6157", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
                      Notre équipe a contrôlé le titre sur pièce. La référence complète et les justificatifs sont communiqués aux acheteurs sérieux, après prise de contact.
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: "#FDFCF8", border: "1.5px solid #E8DDD0" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={18} aria-hidden="true" style={{ color: "#A89B8C" }} />
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#6B5E52" }}>
                        Titre non encore vérifié
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: "#6B5E52", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
                      Ce terrain n&apos;a pas encore fait l&apos;objet d&apos;un contrôle de titre par AKIL IMMO. Nous vous recommandons d&apos;exiger et de vérifier les documents avant tout paiement. Contactez-nous, nous pouvons vous accompagner.
                    </p>
                  </div>
                )}

                {/* Formulaire de demande */}
                <TerrainInquiryForm landId={land.id} landTitle={land.title} landCountry={land.country} />

                {/* Contact */}
                <ContactCardV3 waNumber={waNumber} phoneDisplay={phoneDisplay} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
