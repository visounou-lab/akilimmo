import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "../../../components/v3/Navbar";
import Footer from "../../../components/v3/Footer";
import PropertyGallery from "../../../components/v3/biens/PropertyGallery";
import ReservationFormV3 from "../../../components/v3/biens/ReservationFormV3";
import ShareButtonsV3 from "../../../components/v3/biens/ShareButtonsV3";
import { extractYouTubeId, getPropertyMainImage } from "@/lib/youtube";
import { propertyTypeLabel } from "@/lib/mobile-normalize";
import { SITE_URL, countryLabel } from "@/lib/share";
import { MapPin, BedDouble, Bath } from "lucide-react";
import BreadcrumbV3 from "../../../components/v3/biens/BreadcrumbV3";
import ContactCardV3 from "../../../components/v3/biens/ContactCardV3";
import ViewTracker from "../../../components/v3/biens/ViewTracker";
import ReportListingButton from "../../../components/v3/biens/ReportListingButton";
import TrustBadge from "../../../components/v3/TrustBadge";
import { derivePropertyTrust } from "@/lib/trust-badges";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

const getProperty = cache(async (slug: string) => {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      owner: {
        select: {
          role: true,
          verificationCases: {
            where: { type: { in: ["IDENTITY", "PROFESSIONAL"] } },
            select: { type: true, status: true, expiresAt: true },
          },
        },
      },
      verificationCases: {
        where: { type: { in: ["LISTING_REVIEW", "PHYSICAL_VISIT"] } },
        select: { type: true, status: true, expiresAt: true },
      },
      images: {
        where: { status: "APPROVED" },
        orderBy: { order: "asc" },
      },
    },
  });
});

export async function generateStaticParams() {
  const biens = await prisma.property.findMany({
    where: { publishStatus: "published" },
    select: { slug: true },
  });
  return biens.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) return { title: "Bien introuvable — AKIL IMMO" };

  const price = Number(p.price);
  const priceFmt = new Intl.NumberFormat("fr-FR").format(price);
  const ogImage = getPropertyMainImage({
    videoUrl: p.videoUrl,
    imageUrl: p.imageUrl,
    images: p.images.map((i) => ({ url: i.url, status: i.status, order: i.order })),
  });
  const description =
    p.description?.slice(0, 160) ||
    `${p.title} à ${p.city}, ${countryLabel(p.country)} — ${p.bedrooms} ch., ${p.bathrooms} sdb. AKIL IMMO.`;

  return {
    title: `${p.title} — ${priceFmt} XOF | AKIL IMMO`,
    description,
    openGraph: {
      title: p.title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.title }],
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function V3BienDetailPage({ params }: Props) {
  const { slug } = await params;
  const bien = await getProperty(slug);
  if (!bien) notFound();

  const price = Number(bien.price);
  const priceFmt = new Intl.NumberFormat("fr-FR").format(price);
  const youtubeId = extractYouTubeId(bien.videoUrl);
  const waNumber =
    bien.country === "COTE_D_IVOIRE" ? "2250710259146" : "2290197598682";
  const phoneDisplay =
    bien.country === "COTE_D_IVOIRE" ? "+225 07 10 25 91 46" : "+229 01 97 59 86 82";
  const cLabel = countryLabel(bien.country);
  const pageUrl = `${SITE_URL}/biens/${bien.slug}`;
  const trust = derivePropertyTrust({
    ownerRole: bien.owner.role,
    ownerVerifications: bien.owner.verificationCases,
    propertyVerifications: bien.verificationCases,
  });

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
      {/* Compteur de vues — déclenché côté client, 1 fois par session */}
      <ViewTracker slug={bien.slug} />
      <main id="main-content" className="pt-16" style={{ backgroundColor: "#FDFCF8" }}>

        {/* ── Breadcrumb ── */}
        <BreadcrumbV3 title={bien.title} />

        {/* ── Visite virtuelle ── */}
        {youtubeId && (
          <section className="py-12 lg:py-16" style={{ backgroundColor: "#FDFCF8" }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p
                className="text-center mb-6 text-xs font-medium tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#C8922A",
                  letterSpacing: "0.14em",
                }}
              >
                VISITE VIRTUELLE
              </p>
              <div
                className="relative mx-auto overflow-hidden rounded-2xl"
                style={{
                  maxWidth: 1100,
                  aspectRatio: "16 / 9",
                  boxShadow: "0 8px 32px rgba(28,25,23,0.12)",
                }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={`Visite virtuelle — ${bien.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Galerie photos ── */}
        {bien.images.length > 0 && (
          <PropertyGallery
            images={bien.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
              order: img.order,
            }))}
          />
        )}

        {/* ── Section principale ── */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-8 lg:gap-12 items-start">

              {/* ── Colonne gauche ── */}
              <div className="space-y-10">

                {/* Titre + localisation */}
                <div>
                  <h1
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
                      color: "#1C1917",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {bien.title}
                  </h1>
                  {(trust.listingReviewed ||
                    trust.publisherIdentityVerified ||
                    trust.publisherProfessionalVerified ||
                    trust.physicalVisitVerified) && (
                    <div className="mb-4 flex flex-wrap gap-2" aria-label="Contrôles de confiance">
                      {trust.listingReviewed && <TrustBadge kind="listing-reviewed" />}
                      {trust.publisherProfessionalVerified ? (
                        <TrustBadge kind="agent-verified" />
                      ) : (
                        trust.publisherIdentityVerified && <TrustBadge kind="identity-verified" />
                      )}
                      {trust.physicalVisitVerified && <TrustBadge kind="physical-visit" />}
                    </div>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${bien.address}, ${bien.city}, ${cLabel}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.9rem",
                      color: "#6B5E52",
                      width: "fit-content",
                    }}
                  >
                    <MapPin
                      size={14}
                      aria-hidden="true"
                      style={{ color: "#C8922A", flexShrink: 0 }}
                    />
                    {bien.address}, {bien.city} — {cLabel}
                  </a>
                </div>

                {/* Stats */}
                <div
                  className="flex flex-wrap items-center gap-6 py-4"
                  style={{ borderTop: "1px solid #E8DDD0", borderBottom: "1px solid #E8DDD0" }}
                >
                  <span
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.9rem",
                      color: "#1C1917",
                    }}
                  >
                    <BedDouble size={16} aria-hidden="true" style={{ color: "#C8922A" }} />
                    <strong style={{ fontFamily: "var(--font-playfair), serif" }}>
                      {bien.bedrooms}
                    </strong>{" "}
                    Chambre{bien.bedrooms > 1 ? "s" : ""}
                  </span>
                  <span
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.9rem",
                      color: "#1C1917",
                    }}
                  >
                    <Bath size={16} aria-hidden="true" style={{ color: "#C8922A" }} />
                    <strong style={{ fontFamily: "var(--font-playfair), serif" }}>
                      {bien.bathrooms}
                    </strong>{" "}
                    Salle{bien.bathrooms > 1 ? "s" : ""} de bain
                  </span>
                  {propertyTypeLabel(bien.propertyType) && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        backgroundColor: "rgba(200,146,42,0.1)",
                        color: "#C8922A",
                        border: "1px solid rgba(200,146,42,0.3)",
                      }}
                    >
                      {propertyTypeLabel(bien.propertyType)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p style={sectionTitle}>DESCRIPTION</p>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      color: "#1C1917",
                      marginBottom: "1rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    À propos de ce bien
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9375rem",
                      color: "#3D3530",
                      lineHeight: 1.75,
                      maxWidth: "65ch",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {bien.description}
                  </p>
                </div>

                {/* Localisation */}
                <div>
                  <p style={sectionTitle}>LOCALISATION</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${bien.address}, ${bien.city}, ${cLabel}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 flex items-center gap-1.5 hover:underline"
                    style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#6B5E52", width: "fit-content" }}
                  >
                    <MapPin size={13} style={{ color: "#C8922A", flexShrink: 0 }} />
                    {bien.address}, {bien.city} — {cLabel}
                  </a>
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{ border: "1.5px solid rgba(200,146,42,0.25)", aspectRatio: "16/9" }}
                  >
                    <iframe
                      title={`Localisation — ${bien.title}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${bien.address}, ${bien.city}, ${cLabel}`)}&output=embed&z=15`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                {/* Partage */}
                <ShareButtonsV3
                  url={pageUrl}
                  title={bien.title}
                  price={price}
                  city={bien.city}
                />
              </div>

              {/* ── Colonne droite (sticky) ── */}
              <div className="space-y-5 lg:sticky lg:top-24">

                {/* Card tarif */}
                <div style={card}>
                  <p style={sectionTitle}>TARIF</p>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                      color: "#1C1917",
                      lineHeight: 1,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {priceFmt}{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        color: "#6B5E52",
                      }}
                    >
                      XOF / nuit
                    </span>
                  </p>
                  <div
                    className="mt-4 pt-4 flex items-center gap-2 text-sm"
                    style={{
                      borderTop: "1px solid rgba(200,146,42,0.2)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      color: "#6B5E52",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#C8922A",
                        letterSpacing: "0.06em",
                      }}
                    >
                      AKIL IMMO
                    </span>
                    — Géré par notre agence
                  </div>
                </div>

                {/* Formulaire de réservation */}
                <ReservationFormV3
                  propertyId={bien.id}
                  bienTitle={bien.title}
                  bienCity={bien.city}
                  bienCountry={bien.country}
                  pricePerUnit={price}
                  whatsappNumber={waNumber}
                  bienUrl={pageUrl}
                />

                {/* Card contact + retour */}
                <ContactCardV3 waNumber={waNumber} phoneDisplay={phoneDisplay} />
                <div className="text-center">
                  <ReportListingButton slug={bien.slug} title={bien.title} />
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
