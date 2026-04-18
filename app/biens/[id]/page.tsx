import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { prisma } from "@/lib/prisma";
import { getYouTubeId } from "@/lib/youtube";
import ReservationForm from "./_components/ReservationForm";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN:         "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  AVAILABLE:  { label: "Disponible",   classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  RESERVED:   { label: "Réservé",      classes: "bg-[#0066CC]/10 text-[#0066CC] border border-[#0066CC]/20" },
  RENTED:     { label: "Loué",         classes: "bg-orange-50 text-orange-700 border border-orange-200" },
  OFF_MARKET: { label: "Hors marché",  classes: "bg-slate-100 text-slate-600 border border-slate-200" },
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bien = await prisma.property.findUnique({
    where: { id },
    select: { title: true, city: true, description: true, imageUrl: true, images: { select: { url: true }, take: 1 } },
  });
  if (!bien) return {};
  const desc    = bien.description?.slice(0, 155) ?? "";
  const imgUrl  = bien.imageUrl ?? bien.images?.[0]?.url ?? "https://www.akilimmo.com/og-image.jpg";
  return {
    title: `${bien.title} — ${bien.city}`,
    description: desc,
    openGraph: {
      title: bien.title,
      description: desc,
      images: [imgUrl],
      url: `https://www.akilimmo.com/biens/${id}`,
    },
  };
}

export default async function BienDetailPage({ params }: Props) {
  const { id } = await params;

  const bien = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true } },
      images: { orderBy: { order: "asc" } },
    },
  }) as any;

  if (!bien) notFound();

  console.log("🎥 [BienDetail] videoUrl:", bien.videoUrl);

  const price = new Intl.NumberFormat("fr-FR").format(Number(bien.price));
  const status = STATUS_CONFIG[bien.status] ?? STATUS_CONFIG.OFF_MARKET;

  // YouTube embed ID
  const youtubeId = bien.videoUrl ? getYouTubeId(bien.videoUrl) : null;

  // WhatsApp number based on country
  const whatsappNumber = bien.country === "COTE_D_IVOIRE" ? "2250710259146" : "2290197598682";
  const phoneDisplay = bien.country === "COTE_D_IVOIRE" ? "+225 07 10 25 91 46" : "+229 01 97 59 86 82";

  // Merge video placeholder at start + images
  const mediaItems: { type: "video" | "image"; url?: string; title?: string }[] = [];
  if (youtubeId) {
    mediaItems.push({
      type: "video",
      url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      title: "Visite virtuelle",
    });
  }
  bien.images?.forEach((img: any) => {
    mediaItems.push({ type: "image", url: img.url });
  });

  // Fallback to imageUrl if no images/video
  if (mediaItems.length === 0 && bien.imageUrl) {
    mediaItems.push({ type: "image", url: bien.imageUrl });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
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
            {/* Médias (Vidéo + Photos) */}
            <div className="space-y-3">
              {/* Si vidéo → Embed YouTube uniquement */}
              {youtubeId ? (
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-[#0066CC] px-4 py-1.5 text-sm font-semibold text-white shadow">
                    Visite virtuelle
                  </span>
                  <div className="rounded-[32px] overflow-hidden bg-black aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      title="Visite virtuelle"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                /* Sinon → Première image comme principal */
                mediaItems.length > 0 && (
                  <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#E8F4FD] to-slate-100 aspect-[16/9]">
                    <img
                      src={mediaItems[0].url || ""}
                      alt={bien.title}
                      className="h-full w-full object-cover"
                    />
                    {/* Badge pays */}
                    <span className="absolute top-4 left-4 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#0066CC] shadow">
                      {COUNTRY_LABEL[bien.country] ?? bien.country}
                    </span>
                    {/* Badge statut */}
                    <span className={`absolute top-4 right-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold shadow ${status.classes} bg-white/90 backdrop-blur-sm`}>
                      {status.label}
                    </span>
                  </div>
                )
              )}

              {/* Badges (pays + statut) si pas de vidéo */}
              {!youtubeId && mediaItems.length === 0 && (
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#E8F4FD] to-slate-100 aspect-[16/9] flex items-center justify-center">
                  <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {/* Badge pays */}
                  <span className="absolute top-4 left-4 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#0066CC] shadow">
                    {COUNTRY_LABEL[bien.country] ?? bien.country}
                  </span>
                  {/* Badge statut */}
                  <span className={`absolute top-4 right-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold shadow ${status.classes} bg-white/90 backdrop-blur-sm`}>
                    {status.label}
                  </span>
                </div>
              )}

              {/* Grille des photos additionnelles (skip première si vidéo) */}
              {mediaItems.length > (youtubeId ? 0 : 1) && (
                <div className="grid grid-cols-4 gap-3">
                  {mediaItems.slice(youtubeId ? 0 : 1).map((item, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-[#E8F4FD] to-slate-100">
                      <img src={item.url || ""} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Titre & localisation */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{bien.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-slate-500">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {bien.address}, {bien.city} — {COUNTRY_LABEL[bien.country]}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Chambres", value: bien.bedrooms },
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
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Bloc prix */}
            <div className="rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tarif par nuit</p>
              <p className="text-3xl font-bold text-[#0066CC] leading-none">
                {price}
              </p>
              <p className="text-base text-slate-400 mt-1">XOF / nuit</p>
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
              pricePerUnit={Number(bien.price)}
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

