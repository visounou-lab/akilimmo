"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  images: Array<{ id: string; url: string; alt?: string | null }>;
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
};

export default function PhotoLightbox({ images, isOpen, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")  setIndex((i) => Math.min(images.length - 1, i + 1));
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length, onClose]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen || !thumbsRef.current) return;
    const thumb = thumbsRef.current.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [index, isOpen]);

  if (!isOpen) return null;

  const current = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie photos"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer la galerie"
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition z-10"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main image */}
      <div
        className="flex flex-1 items-center justify-center w-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.alt ?? `Photo ${index + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain select-none rounded-lg shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        disabled={!hasPrev}
        onClick={(e) => { e.stopPropagation(); setIndex((i) => i - 1); }}
        aria-label="Photo précédente"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        type="button"
        disabled={!hasNext}
        onClick={(e) => { e.stopPropagation(); setIndex((i) => i + 1); }}
        aria-label="Photo suivante"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom bar: counter + thumbnails */}
      <div
        className="w-full pb-4 pt-3 px-4 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Counter */}
        <p
          aria-label={`Photo ${index + 1} sur ${images.length}`}
          className="text-sm font-medium text-white/60 tabular-nums"
        >
          {index + 1} / {images.length}
        </p>

        {/* Thumbnails strip */}
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto max-w-[min(100%,680px)] pb-1 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir photo ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`shrink-0 h-14 w-14 overflow-hidden rounded-md border-2 transition-all ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
