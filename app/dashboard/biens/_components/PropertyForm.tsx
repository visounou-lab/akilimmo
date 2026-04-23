"use client";

import { useRef, useState, useEffect } from "react";
import PhotoUploader from "../../../components/PhotoUploader";

const COUNTRIES = [
  { value: "BENIN",         label: "Bénin" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire" },
];

const STATUSES = [
  { value: "AVAILABLE",  label: "Disponible" },
  { value: "RESERVED",   label: "Réservé" },
  { value: "RENTED",     label: "Loué" },
  { value: "OFF_MARKET", label: "Hors marché" },
];

interface ExistingImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface DefaultValues {
  title?: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  price?: number | string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  imageUrl?: string | null;
  videoUrl?: string | null;
  images?: ExistingImage[];
}

interface PropertyFormProps {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
  propertyId?: string;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

function getYouTubeThumbnail(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export default function PropertyForm({
  action,
  defaultValues = {},
  submitLabel = "Enregistrer",
  propertyId,
}: PropertyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New files selected by user (local preview)
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  // Primary index among new files (used to set order=0 in action)
  const [primaryNewIdx, setPrimaryNewIdx] = useState<number>(0);

  // Existing images from DB (in edit mode)
  const [existingImages] = useState<ExistingImage[]>(defaultValues.images ?? []);

  // YouTube video URL + validation
  const [videoUrl, setVideoUrl] = useState<string>(defaultValues.videoUrl ?? "");
  const [videoState, setVideoState] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [videoError, setVideoError] = useState<string>("");
  const videoThumb = videoUrl && videoState === "valid" ? getYouTubeThumbnail(videoUrl) : null;

  useEffect(() => {
    const trimmed = videoUrl.trim();
    if (!trimmed) { setVideoState("idle"); setVideoError(""); return; }
    setVideoState("checking");
    setVideoError("");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube-validate?url=${encodeURIComponent(trimmed)}`);
        const data = await res.json() as { valid: boolean; error?: string };
        setVideoState(data.valid ? "valid" : "invalid");
        setVideoError(data.valid ? "" : (data.error ?? "URL invalide"));
      } catch {
        setVideoState("invalid");
        setVideoError("Impossible de vérifier la vidéo");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [videoUrl]);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPreviews(previews);
    setPrimaryNewIdx(0);
  }

  const videoBlocked = videoState === "invalid" || (videoUrl.trim() !== "" && videoState === "checking");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (videoBlocked) { e.preventDefault(); return; }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-6">
      {/* === PHOTOS === */}
      <div>
        <label className={labelClass}>Photos du bien</label>

        {propertyId ? (
          /* Mode édition : PhotoUploader interactif */
          <PhotoUploader
            propertyId={propertyId}
            initialImages={existingImages.map((img, i) => ({
              id: img.id,
              url: img.url,
              isPrimary: img.isPrimary,
              order: (img as any).order ?? i,
            }))}
          />
        ) : (
          /* Mode création : upload groupé soumis avec le formulaire */
          <>
            <input
              ref={fileInputRef}
              type="file"
              name="images"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
            <input type="hidden" name="primaryIndex" value={primaryNewIdx} />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Ajouter des photos
            </button>
            <p className="text-xs text-slate-400 mt-1.5">JPG, PNG ou WebP · max 15 photos · sélectionnez la principale en cliquant dessus</p>

            {newPreviews.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">Aperçu — cliquez pour définir la principale</p>
                <div className="grid grid-cols-4 gap-2">
                  {newPreviews.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrimaryNewIdx(i)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                        i === primaryNewIdx ? "border-[#0066CC]" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="h-20 w-full object-cover" />
                      {i === primaryNewIdx && (
                        <span className="absolute top-1 left-1 rounded bg-[#0066CC] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          Principale
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* === VIDEO YOUTUBE === */}
      <div>
        <label className={labelClass}>
          Vidéo YouTube{" "}
          <span className="text-slate-400 font-normal">(optionnel — chaîne AKIL IMMO uniquement)</span>
        </label>
        <div className="relative">
          <input
            type="url"
            name="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`${inputClass} pr-10 ${
              videoState === "invalid" ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" :
              videoState === "valid"   ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20" : ""
            }`}
          />
          {/* indicator icon */}
          {videoState === "checking" && (
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {videoState === "valid" && (
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {videoState === "invalid" && (
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        {videoState === "invalid" && videoError && (
          <p className="mt-1 text-xs text-red-600">{videoError}</p>
        )}
        {videoThumb && (
          <div className="mt-2 relative w-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <img src={videoThumb} alt="Aperçu vidéo" className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <svg className="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Titre */}
      <div>
        <label className={labelClass}>Titre <span className="text-red-400">*</span></label>
        <input type="text" name="title" required defaultValue={defaultValues.title} placeholder="ex : Villa moderne à Cotonou" className={inputClass} />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description <span className="text-red-400">*</span></label>
        <textarea name="description" required rows={4} defaultValue={defaultValues.description} placeholder="Décrivez le bien en détail…" className={inputClass + " resize-none"} />
      </div>

      {/* Pays / Ville */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Pays <span className="text-red-400">*</span></label>
          <select name="country" required defaultValue={defaultValues.country ?? "BENIN"} className={inputClass}>
            {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ville <span className="text-red-400">*</span></label>
          <input type="text" name="city" required defaultValue={defaultValues.city} placeholder="ex : Cotonou" className={inputClass} />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <label className={labelClass}>Adresse <span className="text-red-400">*</span></label>
        <input type="text" name="address" required defaultValue={defaultValues.address} placeholder="ex : Quartier Fidjrossè, rue 12" className={inputClass} />
      </div>

      {/* Prix / Statut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prix (XOF/nuit) <span className="text-red-400">*</span></label>
          <input type="number" name="price" required min={0} step={1000} defaultValue={defaultValues.price?.toString()} placeholder="ex : 250000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Statut <span className="text-red-400">*</span></label>
          <select name="status" required defaultValue={defaultValues.status ?? "AVAILABLE"} className={inputClass}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Chambres / SDB */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Chambres <span className="text-red-400">*</span></label>
          <input type="number" name="bedrooms" required min={0} defaultValue={defaultValues.bedrooms} placeholder="3" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Salles de bain <span className="text-red-400">*</span></label>
          <input type="number" name="bathrooms" required min={0} defaultValue={defaultValues.bathrooms} placeholder="2" className={inputClass} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={videoBlocked}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {submitLabel}
        </button>
        <a href="/dashboard/biens" className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          Annuler
        </a>
      </div>
    </form>
  );
}
