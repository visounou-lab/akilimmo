"use client";

import { useState } from "react";
import PhotoLightbox from "./PhotoLightbox";

type MediaItem = {
  type: "video" | "image";
  id: string;
  url: string;
  alt?: string | null;
};

type Props = {
  mediaItems: MediaItem[];
  title: string;
  statusLabel: string;
  statusClasses: string;
  countryLabel: string;
  youtubeId: string | null;
};

export default function PhotoGallery({
  mediaItems,
  title,
  statusLabel,
  statusClasses,
  countryLabel: country,
  youtubeId,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only image items are zoomable in the lightbox
  const lightboxImages = mediaItems.filter((m) => m.type === "image");

  function openLightbox(item: MediaItem) {
    if (item.type !== "image") return;
    const idx = lightboxImages.findIndex((i) => i.id === item.id);
    if (idx >= 0) setLightboxIndex(idx);
  }

  const heroItem = mediaItems[0];
  const thumbItems = mediaItems.slice(youtubeId ? 0 : 1);

  return (
    <>
      <div className="space-y-3">
        {youtubeId ? (
          <div className="space-y-2">
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
            {/* Badge outside the iframe — n'interfère plus avec l'UI YouTube */}
            <div className="flex justify-end px-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00D4F0] px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Visite virtuelle
              </span>
            </div>
          </div>
        ) : heroItem ? (
          <button
            type="button"
            onClick={() => openLightbox(heroItem)}
            className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-[#E8F4FD] to-slate-100 aspect-[16/9] cursor-zoom-in group"
            aria-label="Agrandir la photo"
          >
            <img
              src={heroItem.url}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute top-4 left-4 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#0066CC] shadow">
              {country}
            </span>
            <span className={`absolute top-4 right-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold shadow ${statusClasses} bg-white/90 backdrop-blur-sm`}>
              {statusLabel}
            </span>
            {/* Zoom hint */}
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-6-3v6M8 11h6" />
              </svg>
              Agrandir
            </span>
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#E8F4FD] to-slate-100 aspect-[16/9] flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="absolute top-4 left-4 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#0066CC] shadow">
              {country}
            </span>
            <span className={`absolute top-4 right-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold shadow ${statusClasses} bg-white/90 backdrop-blur-sm`}>
              {statusLabel}
            </span>
          </div>
        )}

        {thumbItems.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {thumbItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openLightbox(item)}
                aria-label={`Voir photo ${i + (youtubeId ? 1 : 2)}`}
                className="relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-[#E8F4FD] to-slate-100 cursor-zoom-in group"
              >
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 group-hover:opacity-90"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <PhotoLightbox
        images={lightboxImages}
        isOpen={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
