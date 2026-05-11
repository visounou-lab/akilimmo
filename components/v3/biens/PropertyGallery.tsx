"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
};

export default function PropertyGallery({ images }: { images: GalleryImage[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const carouselTouchX = useRef(0);
  const lightboxTouchX = useRef(0);
  const total = images.length;

  const prev = useCallback(() => setActiveIdx((i) => (i === 0 ? total - 1 : i - 1)), [total]);
  const next = useCallback(() => setActiveIdx((i) => (i === total - 1 ? 0 : i + 1)), [total]);

  const lbPrev = useCallback(
    () => setLightboxIdx((i) => (i === 0 ? total - 1 : i - 1)),
    [total]
  );
  const lbNext = useCallback(
    () => setLightboxIdx((i) => (i === total - 1 ? 0 : i + 1)),
    [total]
  );

  function openLightbox(idx: number) {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  }

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") lbPrev();
      else if (e.key === "ArrowRight") lbNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen, lbPrev, lbNext]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (total === 0) return null;

  const active = images[activeIdx];
  const lbImage = images[lightboxIdx];

  const arrowBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#FDFCF8",
    color: "#C8922A",
    boxShadow: "0 2px 10px rgba(28,25,23,0.18)",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.15s, color 0.15s",
  };

  return (
    <section
      aria-labelledby="gallery-heading"
      className="py-16 lg:py-20"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="mb-3 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.14em",
            }}
          >
            GALERIE PHOTOS
          </p>
          <h2
            id="gallery-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
            }}
          >
            Plus de détails en images
          </h2>
        </div>

        {/* Main carousel */}
        <div
          className="relative mx-auto overflow-hidden rounded-2xl"
          style={{
            maxWidth: 1100,
            aspectRatio: "16 / 10",
            boxShadow: "0 8px 32px rgba(28,25,23,0.14)",
          }}
          onTouchStart={(e) => { carouselTouchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = carouselTouchX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
          }}
        >
          {/* Image */}
          <Image
            src={active.url}
            alt={active.alt ?? `Photo ${activeIdx + 1}`}
            fill
            className="object-cover"
            priority={activeIdx === 0}
            sizes="(max-width: 768px) 100vw, 1100px"
          />

          {/* Clickable overlay → lightbox */}
          <button
            type="button"
            className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ zIndex: 5, cursor: "zoom-in", ["--tw-ring-color" as string]: "#C8922A" }}
            onClick={() => openLightbox(activeIdx)}
            aria-label={`Agrandir : ${active.alt ?? `photo ${activeIdx + 1}`}`}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
              if (e.key === "ArrowRight") { e.preventDefault(); next(); }
            }}
          />

          {/* Left arrow */}
          {total > 1 && (
            <button
              type="button"
              aria-label="Photo précédente"
              style={{ ...arrowBase, left: 12 }}
              onClick={(e) => { e.stopPropagation(); prev(); }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C8922A";
                e.currentTarget.style.color = "#FDFCF8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FDFCF8";
                e.currentTarget.style.color = "#C8922A";
              }}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          )}

          {/* Right arrow */}
          {total > 1 && (
            <button
              type="button"
              aria-label="Photo suivante"
              style={{ ...arrowBase, right: 12 }}
              onClick={(e) => { e.stopPropagation(); next(); }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C8922A";
                e.currentTarget.style.color = "#FDFCF8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FDFCF8";
                e.currentTarget.style.color = "#C8922A";
              }}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          )}

          {/* Counter */}
          <div
            aria-live="polite"
            aria-label={`Photo ${activeIdx + 1} sur ${total}`}
            className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-medium select-none"
            style={{
              zIndex: 10,
              backgroundColor: "rgba(253,252,248,0.92)",
              color: "#C8922A",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {activeIdx + 1} / {total}
          </div>
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div
            role="list"
            aria-label="Miniatures de la galerie"
            className="mt-4 flex gap-3 overflow-x-auto pb-2 mx-auto"
            style={{ maxWidth: 1100 }}
          >
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                role="listitem"
                onClick={() => setActiveIdx(idx)}
                aria-label={`Voir ${img.alt ?? `photo ${idx + 1}`}`}
                aria-pressed={idx === activeIdx}
                className="relative shrink-0 overflow-hidden rounded-lg cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2"
                style={{
                  width: 120,
                  height: 80,
                  border: `3px solid ${idx === activeIdx ? "#C8922A" : "transparent"}`,
                  opacity: idx === activeIdx ? 1 : 0.6,
                  ["--tw-ring-color" as string]: "#C8922A",
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `Miniature ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galerie plein écran"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
          onClick={() => setLightboxOpen(false)}
          onTouchStart={(e) => { lightboxTouchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = lightboxTouchX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50) { e.stopPropagation(); dx > 0 ? lbNext() : lbPrev(); }
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Fermer la galerie"
            className="absolute top-4 right-4 z-20 flex items-center justify-center cursor-pointer rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "rgba(253,252,248,0.1)",
              color: "#FDFCF8",
              border: "1.5px solid rgba(253,252,248,0.2)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C8922A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(253,252,248,0.1)"; }}
          >
            <X size={18} aria-hidden="true" />
          </button>

          {/* Image */}
          <div
            className="relative"
            style={{ width: "90vw", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lbImage.url}
              alt={lbImage.alt ?? `Photo ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Lightbox nav */}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={(e) => { e.stopPropagation(); lbPrev(); }}
                className="absolute left-4 flex items-center justify-center cursor-pointer rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(253,252,248,0.1)",
                  color: "#C8922A",
                  border: "1.5px solid rgba(200,146,42,0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C8922A"; e.currentTarget.style.color = "#FDFCF8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(253,252,248,0.1)"; e.currentTarget.style.color = "#C8922A"; }}
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={(e) => { e.stopPropagation(); lbNext(); }}
                className="absolute right-4 flex items-center justify-center cursor-pointer rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(253,252,248,0.1)",
                  color: "#C8922A",
                  border: "1.5px solid rgba(200,146,42,0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C8922A"; e.currentTarget.style.color = "#FDFCF8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(253,252,248,0.1)"; e.currentTarget.style.color = "#C8922A"; }}
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </>
          )}

          {/* Lightbox counter */}
          <div
            aria-live="polite"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-medium select-none"
            style={{
              backgroundColor: "rgba(253,252,248,0.12)",
              color: "#C8922A",
              fontFamily: "var(--font-inter), sans-serif",
              border: "1px solid rgba(200,146,42,0.25)",
            }}
          >
            {lightboxIdx + 1} / {total}
          </div>
        </div>
      )}
    </section>
  );
}
