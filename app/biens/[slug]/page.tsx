import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { prisma } from "@/lib/prisma";
import { getYouTubeId } from "@/lib/youtube";
import {
  SITE_URL,
  buildPropertyUrl,
  ogImageUrl,
  formatFCFA,
  countryLabel,
} from "@/lib/share";
import ReservationForm from "../[id]/_components/ReservationForm";
import ShareButtons from "../../components/ShareButtons";
import PhotoGallery from "../../components/PhotoGallery";

type Props = { params: Promise<{ slug: string }> };

async function getProperty(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      owner:  { select: { name: true } },
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) return { title: "Bien introuvable — AKIL IMMO" };

  const price       = Number(p.price);
  const url         = buildPropertyUrl(p.slug);
  const primaryImg  = p.images.find((i) => i.isPrimary) ?? p.images[0];
  const ogImage     = ogImageUrl(primaryImg?.url ?? p.imageUrl);
  const title       = `${p.title} — ${formatFCFA(price)}`;
  const description = p.description?.slice(0, 160) ||
    `${p.title} à ${p.city}, ${countryLabel(p.country)} — ${p.bedrooms} chambres, ${p.bathrooms} salles de bain. AKIL IMMO.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type:        "website",
      locale:      "fr_FR",
      url,
      siteName:    "AKIL IMMO",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImage],
    },
  };
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  AVAILABLE:  { label: "Disponible",   classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  RESERVED:   { label: "Réservé",      classes: "bg-[#0066CC]/10 text-[#0066CC] border border-[#0066CC]/20" },
  RENTED:     { label: "Loué",         classes: "bg-orange-50 text-orange-700 border border-orange-200" },
  OFF_MARKET: { label: "Hors marché",  classes: "bg-slate-100 text-slate-600 border border-slate-200" },
};

export default async function BienDetailSlugPage({ params }: Props) {
  const { slug } = await params;
  const bien = await getProperty(slug);
  if (!bien) notFound();

  const price        = Number(bien.price);
  const url          = buildPropertyUrl(bien.slug);
  const primaryImg   = bien.images.find((i) => i.isPrimary) ?? bien.images[0];
  const heroUrl      = primaryImg?.url ?? bien.imageUrl;
  const ogImage      = ogImageUrl(heroUrl);
  const available    = bien.status === "AVAILABLE";
  const status    = STATUS_CONFIG[bien.status] ?? STATUS_CONFIG.OFF_MARKET;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Product",
    name:        bien.title,
    description: bien.description,
    image:       bien.images.length > 0
      ? bien.images.slice(0, 6).map((i) => i.url)
      : ogImage,
    url,
    category:    "RealEstate",
    brand: { "@type": "Organization", name: "AKIL IMMO", url: SITE_URL },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Chambres",       value: bien.bedrooms },
      { "@type": "PropertyValue", name: "Salles de bain", value: bien.bathrooms },
    ],
    offers: {
      "@type":        "Offer",
      price,
      priceCurrency:  "XOF",
      url,
      availability:   available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      areaServed: `${bien.city}, ${countryLabel(bien.country)}`,
    },
  };

  const youtubeId    = bien.videoUrl ? getYouTubeId(bien.videoUrl) : null;
  const whatsappNumber = bien.country === "COTE_D_IVOIRE" ? "2250710259146" : "2290197598682";
  const phoneDisplay   = bien.country === "COTE_D_IVOIRE" ? "+225 07 10 25 91 46" : "+229 01 97 59 86 82";

  // Primary image first, then rest in order
  const sortedImages = [...(bien.images ?? [])].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.order - b.order;
  });

  type MediaItem = { type: "video" | "image"; id: string; url: string; alt?: string | null };
  const mediaItems: MediaItem[] = [];
  if (youtubeId) {
    mediaItems.push({ type: "video", id: `yt-${youtubeId}`, url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` });
  }
  sortedImages.forEach((img) => mediaItems.push({ type: "image", id: img.id, url: img.url, alt: null }));
  if (mediaItems.length === 0 && bien.imageUrl) {
    mediaItems.push({ type: "image", id: "fallback", url: bien.imageUrl });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-[#0066CC] transition-colors">Accueil</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/biens" className="hover:text-[#0066CC] transition-colors">Biens</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600 truncate max-w-[200px]">{bien.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Colonne principale */}
          <div className="space-y-6">
            {/* Médias */}
            <PhotoGallery
              mediaItems={mediaItems}
              title={bien.title}
              statusLabel={status.label}
              statusClasses={status.classes}
              countryLabel={countryLabel(bien.country)}
              youtubeId={youtubeId}
            />

            {/* Titre & localisation */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{bien.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-slate-500">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {bien.address}, {bien.city} — {countryLabel(bien.country)}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Chambres",       value: bien.bedrooms },
                { label: "Salles de bain", value: bien.bathrooms },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-sm">
                  <p className="text-2xl font-bold text-[#0066CC]">{c.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{bien.description}</p>
            </div>

            <ShareButtons
              url={url}
              title={bien.title}
              price={price}
              city={bien.city}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Bloc prix */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tarif</p>
              <p className="text-3xl font-bold text-[#0066CC] leading-none">
                {formatFCFA(price)}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Géré par AKIL IMMO
              </div>
            </div>

            {/* Formulaire de réservation */}
            <ReservationForm
              bienTitle={bien.title}
              bienCity={bien.city}
              bienCountry={bien.country}
              pricePerUnit={price}
              whatsappNumber={whatsappNumber}
            />

            {/* Contact agence */}
            <div id="contact-agence" className="rounded-3xl bg-[#0066CC] p-7 text-white shadow-xl">
              <h3 className="font-semibold text-lg mb-1">Contacter l&apos;agence</h3>
              <p className="text-white/80 text-sm mb-5">Nous répondons rapidement à toutes vos demandes.</p>
              <div className="space-y-2 text-sm">
                <a href="mailto:info@akilimmo.com" className="flex items-center gap-2 hover:text-white/80 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@akilimmo.com
                </a>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phoneDisplay}
                </p>
              </div>
            </div>

            {/* Retour liste */}
            <Link
              href="/biens"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux biens
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
