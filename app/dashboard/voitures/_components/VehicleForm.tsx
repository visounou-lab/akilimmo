"use client";

import { useRef, useState } from "react";

interface VehicleDefaults {
  name?: string;
  variant?: string;
  color?: string;
  seats?: number;
  fuel?: string;
  features?: string[];
  priceDay?: number;
  priceLong?: number;
  available?: boolean;
  images?: string[];
}

type PhotoItem =
  | { kind: "existing"; url: string }
  | { kind: "new"; preview: string; file: File };

interface VehicleFormProps {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: VehicleDefaults;
  submitLabel?: string;
  vehicleId?: string;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#C8922A] focus:ring-2 focus:ring-[#C8922A]/20 transition-colors";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function VehicleForm({
  action,
  defaultValues = {},
  submitLabel = "Enregistrer",
}: VehicleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Galerie unifiée : existantes + nouvelles
  const [photos, setPhotos] = useState<PhotoItem[]>(
    (defaultValues.images ?? []).map((url) => ({ kind: "existing", url }))
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ── Ajout de nouveaux fichiers ── */
  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const items: PhotoItem[] = files.map((f) => ({
      kind: "new",
      preview: URL.createObjectURL(f),
      file: f,
    }));
    setPhotos((prev) => [...prev, ...items]);
    e.target.value = "";
  }

  /* ── Suppression d'une photo ── */
  function removePhoto(index: number) {
    setPhotos((prev) => {
      const item = prev[index];
      if (item.kind === "new") URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  /* ── Drag & drop ── */
  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  /* ── Soumission ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Supprime les champs images bruts (on gère manuellement)
    formData.delete("images");

    // Calcule l'ordre final et upload les nouvelles uniquement
    const newFiles = photos.filter((p): p is Extract<PhotoItem, { kind: "new" }> => p.kind === "new");
    let newFileIdx = 0;

    const photoOrder = photos.map((p) => {
      if (p.kind === "existing") return { kind: "existing", url: p.url };
      return { kind: "new", fileIndex: newFileIdx++ };
    });

    formData.set("photoOrder", JSON.stringify(photoOrder));
    for (const p of newFiles) {
      formData.append("images", p.file);
    }

    try {
      await action(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── GALERIE PHOTOS ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + " mb-0"}>Photos du véhicule</label>
          {photos.length > 0 && (
            <span className="text-xs text-slate-400">
              {photos.length} photo{photos.length > 1 ? "s" : ""} — glissez pour réorganiser
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />

        {photos.length === 0 ? (
          /* Zone vide */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 py-12 text-slate-400 hover:border-[#C8922A] hover:text-[#C8922A] transition-colors"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium">Cliquer pour ajouter des photos</p>
              <p className="text-xs mt-0.5 text-slate-400">JPG, PNG ou WebP</p>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo, i) => {
              const src = photo.kind === "existing" ? photo.url : photo.preview;
              const isDragging = dragIndex === i;

              return (
                <div
                  key={photo.kind === "existing" ? photo.url : photo.preview}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className="relative rounded-xl overflow-hidden select-none"
                  style={{
                    aspectRatio: "4/3",
                    border: `2px solid ${i === 0 ? "#C8922A" : isDragging ? "#94a3b8" : "#E2E8F0"}`,
                    opacity: isDragging ? 0.55 : 1,
                    cursor: "grab",
                    transition: "border-color 0.12s, opacity 0.12s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover pointer-events-none" />

                  {/* Badge principale */}
                  {i === 0 && (
                    <span className="absolute top-2 left-2 rounded-lg bg-[#C8922A] px-2 py-0.5 text-[11px] font-bold text-white shadow">
                      Principale
                    </span>
                  )}

                  {/* Numéro */}
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>

                  {/* Icône drag (6 points) */}
                  <div className="absolute bottom-2 right-8 rounded-md bg-black/40 p-1 pointer-events-none">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="6" cy="4" r="1.5"/><circle cx="14" cy="4" r="1.5"/>
                      <circle cx="6" cy="10" r="1.5"/><circle cx="14" cy="10" r="1.5"/>
                      <circle cx="6" cy="16" r="1.5"/><circle cx="14" cy="16" r="1.5"/>
                    </svg>
                  </div>

                  {/* Bouton × supprimer */}
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 rounded-lg bg-black/50 p-1 hover:bg-red-500 transition-colors"
                    title="Supprimer cette photo"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Badge "existante" vs "nouvelle" */}
                  {photo.kind === "new" && (
                    <span className="absolute top-2 right-8 rounded-md bg-emerald-500/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Nouvelle
                    </span>
                  )}
                </div>
              );
            })}

            {/* Case "+ Ajouter" */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-[#C8922A] hover:text-[#C8922A] transition-colors"
              style={{ aspectRatio: "4/3" }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium">Ajouter</span>
            </button>
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400">La 1ère photo est la photo principale affichée sur le site</p>
            <button
              type="button"
              onClick={() => { photos.forEach((p) => { if (p.kind === "new") URL.revokeObjectURL(p.preview); }); setPhotos([]); }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Tout supprimer
            </button>
          </div>
        )}
      </div>

      {/* ── NOM + CATÉGORIE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom du véhicule <span className="text-red-400">*</span></label>
          <input type="text" name="name" required defaultValue={defaultValues.name} placeholder="ex : KIA Sportage" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Catégorie</label>
          <input type="text" name="variant" defaultValue={defaultValues.variant ?? "SUV"} placeholder="SUV, Berline…" className={inputClass} />
        </div>
      </div>

      {/* ── COULEUR + PLACES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Couleur <span className="text-red-400">*</span></label>
          <input type="text" name="color" required defaultValue={defaultValues.color} placeholder="ex : Blanc perle" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Nombre de places</label>
          <input type="number" name="seats" min={1} max={9} defaultValue={defaultValues.seats ?? 5} className={inputClass} />
        </div>
      </div>

      {/* ── MOTORISATION ── */}
      <div>
        <label className={labelClass}>Motorisation</label>
        <input type="text" name="fuel" defaultValue={defaultValues.fuel ?? "Essence · Automatique"} placeholder="ex : Essence · Automatique" className={inputClass} />
      </div>

      {/* ── ÉQUIPEMENTS ── */}
      <div>
        <label className={labelClass}>
          Équipements <span className="text-slate-400 font-normal">(un par ligne)</span>
        </label>
        <textarea
          name="features"
          rows={5}
          defaultValue={(defaultValues.features ?? []).join("\n")}
          placeholder={"Climatisation\nBluetooth\nCaméra de recul\nGPS\n4×4 AWD"}
          className={inputClass + " resize-none"}
        />
      </div>

      {/* ── PRIX ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prix court séjour <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="number" name="priceDay" required min={0} step={1000} defaultValue={defaultValues.priceDay ?? 70000} className={inputClass + " pr-20"} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">XOF / jour</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Prix long séjour <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="number" name="priceLong" required min={0} step={1000} defaultValue={defaultValues.priceLong ?? 60000} className={inputClass + " pr-20"} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">XOF / jour</span>
          </div>
        </div>
      </div>

      {/* ── DISPONIBILITÉ ── */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" name="available" defaultChecked={defaultValues.available ?? true} className="w-4 h-4 rounded accent-[#C8922A]" />
          <span className="text-sm font-medium text-slate-700">Véhicule disponible à la location</span>
        </label>
      </div>

      {/* ── BOUTONS ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2D2420] disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enregistrement…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {submitLabel}
            </>
          )}
        </button>
        <a href="/dashboard/voitures" className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          Annuler
        </a>
      </div>
    </form>
  );
}
