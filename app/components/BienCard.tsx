import Link from "next/link";
import { getYouTubeId, getYoutubeThumbnail } from "@/lib/youtube";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN:         "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

interface BienCardProps {
  bien: {
    id: string;
    title: string;
    city: string;
    country: string;
    price: unknown;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string | null;
    videoUrl?: string | null;
  };
}

export default function BienCard({ bien }: BienCardProps) {
  // Tarification par nuit
  const price = new Intl.NumberFormat("fr-FR").format(Number(bien.price));

  // Determine image source: YouTube thumbnail > imageUrl > placeholder
  let displayImage: string | null = null;
  let hasVideo = false;

  if (bien.videoUrl) {
    const videoId = getYouTubeId(bien.videoUrl);
    if (videoId) {
      displayImage = getYoutubeThumbnail(bien.videoUrl) || null;
      hasVideo = true;
    }
  }

  if (!displayImage && bien.imageUrl) {
    displayImage = bien.imageUrl;
  }

  return (
    <Link href={`/biens/${bien.id}`}>
      <article className="group overflow-hidden rounded-none sm:rounded-[28px] border-b sm:border border-slate-200 bg-white shadow-none sm:shadow-sm transition sm:hover:-translate-y-1 sm:hover:shadow-xl cursor-pointer">
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#E8F4FD] to-slate-100">
          {displayImage ? (
            <img
              src={displayImage}
              alt={bien.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          {/* Video indicator */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {/* Badge pays */}
          <span className="absolute top-3 left-3 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#0066CC] shadow-sm">
            {COUNTRY_LABEL[bien.country] ?? bien.country}
          </span>
        </div>

        {/* Infos */}
        <div className="p-5">
          <h3 className="font-semibold text-slate-900 leading-snug mb-1 group-hover:text-[#0066CC] transition-colors">
            {bien.title}
          </h3>
          <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {bien.city}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#0066CC]">
              {price} <span className="text-sm font-normal text-slate-400">XOF / nuit</span>
            </p>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {bien.bedrooms} ch.
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {bien.bathrooms} sdb
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
