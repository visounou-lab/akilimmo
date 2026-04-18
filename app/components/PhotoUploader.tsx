"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  uploadPropertyImages,
  deletePropertyImage,
  setPrimaryPropertyImage,
  reorderPropertyImages,
} from "../dashboard/biens/_actions";

type ImageItem = {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
};

type Props = {
  propertyId: string;
  initialImages: ImageItem[];
};

export default function PhotoUploader({ propertyId, initialImages }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>(
    [...initialImages].sort((a, b) => a.order - b.order)
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── upload ────────────────────────────────────────────────────────────────

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    setErrorMsg(null);
    setSuccessMsg(null);

    if (images.length + files.length > 15) {
      setErrorMsg(`Maximum 15 photos par bien (${images.length} déjà enregistrée(s)).`);
      return;
    }

    const MAX_PER_FILE = 10 * 1024 * 1024;
    const MAX_TOTAL = 50 * 1024 * 1024;
    const oversized = files.filter((f) => f.size > MAX_PER_FILE);
    if (oversized.length > 0) {
      setErrorMsg(`Fichier(s) trop volumineux (max 10 Mo) : ${oversized.map((f) => f.name).join(", ")}`);
      return;
    }
    const totalSize = files.reduce((s, f) => s + f.size, 0);
    if (totalSize > MAX_TOTAL) {
      setErrorMsg(`Sélection trop lourde (max 50 Mo au total). Réduisez le nombre de fichiers.`);
      return;
    }

    setUploading(true);
    let result: { uploaded: number; errors: string[] };
    try {
      result = await uploadPropertyImages(propertyId, files);
    } catch (e) {
      console.error("[PhotoUploader] handleFiles error:", e);
      setErrorMsg(e instanceof Error ? e.message : "Erreur inattendue lors de l'upload.");
      setUploading(false);
      return;
    }
    setUploading(false);

    if (result.errors.length) {
      setErrorMsg("Certaines photos n'ont pas pu être uploadées : " + result.errors.join(", "));
    }
    if (result.uploaded > 0) {
      setSuccessMsg(`✓ ${result.uploaded} photo${result.uploaded > 1 ? "s" : ""} ajoutée${result.uploaded > 1 ? "s" : ""}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    router.refresh();
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  // ── delete ────────────────────────────────────────────────────────────────

  async function handleDelete(img: ImageItem) {
    if (!window.confirm(`Supprimer cette photo ?`)) return;
    setErrorMsg(null);
    setBusyId(img.id);
    const res = await deletePropertyImage(img.id);
    setBusyId(null);
    if (!res.success) { setErrorMsg(res.error ?? "Erreur lors de la suppression."); return; }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    router.refresh();
  }

  // ── set primary ───────────────────────────────────────────────────────────

  async function handleSetPrimary(img: ImageItem) {
    if (img.isPrimary) return;
    setErrorMsg(null);
    setBusyId(img.id);
    const res = await setPrimaryPropertyImage(img.id);
    setBusyId(null);
    if (!res.success) { setErrorMsg("Erreur lors du changement de photo principale."); return; }
    setImages((prev) =>
      prev.map((i) => ({ ...i, isPrimary: i.id === img.id }))
    );
    router.refresh();
  }

  // ── reorder ───────────────────────────────────────────────────────────────

  async function handleMove(img: ImageItem, dir: -1 | 1) {
    const idx = images.findIndex((i) => i.id === img.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= images.length) return;

    const next = [...images];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    const reordered = next.map((i, o) => ({ ...i, order: o }));
    setImages(reordered);

    setBusyId(img.id);
    await reorderPropertyImages(propertyId, reordered.map((i) => i.id));
    setBusyId(null);
    router.refresh();
  }

  const busy = uploading || busyId !== null;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        aria-label="Zone d'upload de photos — cliquez ou glissez des fichiers"
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors select-none ${
          dragOver
            ? "border-[#0066CC] bg-[#E8F4FD]"
            : "border-slate-300 bg-slate-50 hover:border-[#0066CC] hover:bg-[#F0F7FF]"
        }`}
      >
        {uploading ? (
          <svg className="h-6 w-6 animate-spin text-[#0066CC]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
          </svg>
        ) : (
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
        <p className="text-sm font-medium text-slate-600">
          {uploading ? "Envoi en cours…" : "Glissez vos photos ici ou cliquez pour parcourir"}
        </p>
        <p className="text-xs text-slate-400">JPG, PNG, WebP · max 15 photos au total</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
        aria-hidden="true"
      />

      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600" aria-label="Fermer">✕</button>
        </div>
      )}

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
          {successMsg}
        </div>
      )}

      {/* Compteur */}
      <p className="text-xs text-slate-400">{images.length} / 15 photo{images.length !== 1 ? "s" : ""}</p>

      {/* Grille */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => {
            const isBusy = busyId === img.id || uploading;
            return (
              <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.isPrimary ? "Photo principale" : `Photo ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Badge principale */}
                {img.isPrimary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Principale
                  </span>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1">
                    {/* Flèche gauche */}
                    <button
                      type="button"
                      disabled={isBusy || idx === 0}
                      onClick={() => handleMove(img, -1)}
                      aria-label="Déplacer à gauche"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Flèche droite */}
                    <button
                      type="button"
                      disabled={isBusy || idx === images.length - 1}
                      onClick={() => handleMove(img, 1)}
                      aria-label="Déplacer à droite"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Étoile principale */}
                    <button
                      type="button"
                      disabled={isBusy || img.isPrimary}
                      onClick={() => handleSetPrimary(img)}
                      aria-label="Définir comme photo principale"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/80 text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>

                    {/* Supprimer */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(img)}
                      aria-label="Supprimer cette photo"
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Spinner par image */}
                {busyId === img.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
