"use client";

import { useRef, useState } from "react";

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
}

interface PropertyFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function PropertyForm({
  action,
  defaultValues = {},
  submitLabel = "Enregistrer",
}: PropertyFormProps) {
  const [preview, setPreview] = useState<string | null>(defaultValues.imageUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={action} encType="multipart/form-data" className="space-y-6">
      {/* Photo */}
      <div>
        <label className={labelClass}>Photo du bien</label>
        <div className="flex items-start gap-4">
          <div
            className="w-32 h-24 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 shrink-0 cursor-pointer hover:border-[#0066CC] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <svg className="w-6 h-6 text-slate-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-slate-400">Choisir</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Parcourir…
            </button>
            <p className="text-xs text-slate-400 mt-2">JPG, PNG ou WebP · max 5 Mo</p>
          </div>
        </div>
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
          <label className={labelClass}>Prix (XOF/mois) <span className="text-red-400">*</span></label>
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
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
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
