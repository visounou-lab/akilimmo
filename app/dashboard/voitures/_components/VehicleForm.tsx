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
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [keepImages, setKeepImages] = useState(true);

  const existingImages = defaultValues.images ?? [];

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form action={action} className="space-y-6">
      {/* Images */}
      <div>
        <label className={labelClass}>Photos du véhicule</label>

        {existingImages.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-2">Photos actuelles ({existingImages.length})</p>
            <div className="grid grid-cols-4 gap-2">
              {existingImages.map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-20 w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-[#1C1917] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
            <input type="hidden" name="existingImages" value={existingImages.join(",")} />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={keepImages}
                onChange={(e) => setKeepImages(e.target.checked)}
                className="rounded"
              />
              <input type="hidden" name="keepImages" value={keepImages ? "true" : "false"} />
              Conserver les photos existantes (et ajouter les nouvelles)
            </label>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
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
          {existingImages.length > 0 ? "Ajouter d'autres photos" : "Ajouter des photos"}
        </button>
        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG ou WebP · la 1ère photo sera la principale</p>

        {newPreviews.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">Nouvelles photos ({newPreviews.length})</p>
            <div className="grid grid-cols-4 gap-2">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-20 w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-[#C8922A] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nom + Variante */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom du véhicule <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaultValues.name}
            placeholder="ex : KIA Sportage"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Catégorie</label>
          <input
            type="text"
            name="variant"
            defaultValue={defaultValues.variant ?? "SUV"}
            placeholder="SUV, Berline…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Couleur + Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Couleur <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="color"
            required
            defaultValue={defaultValues.color}
            placeholder="ex : Blanc"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nombre de places</label>
          <input
            type="number"
            name="seats"
            min={1}
            max={9}
            defaultValue={defaultValues.seats ?? 5}
            className={inputClass}
          />
        </div>
      </div>

      {/* Carburant */}
      <div>
        <label className={labelClass}>Motorisation</label>
        <input
          type="text"
          name="fuel"
          defaultValue={defaultValues.fuel ?? "Essence · Automatique"}
          placeholder="ex : Essence · Automatique"
          className={inputClass}
        />
      </div>

      {/* Équipements */}
      <div>
        <label className={labelClass}>
          Équipements{" "}
          <span className="text-slate-400 font-normal">(un par ligne)</span>
        </label>
        <textarea
          name="features"
          rows={4}
          defaultValue={(defaultValues.features ?? []).join("\n")}
          placeholder={"Climatisation\nBluetooth\nCaméra de recul\nGPS"}
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Prix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prix court séjour <span className="text-red-400">*</span></label>
          <div className="relative">
            <input
              type="number"
              name="priceDay"
              required
              min={0}
              step={1000}
              defaultValue={defaultValues.priceDay ?? 70000}
              className={inputClass + " pr-20"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
              XOF / jour
            </span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Prix long séjour <span className="text-red-400">*</span></label>
          <div className="relative">
            <input
              type="number"
              name="priceLong"
              required
              min={0}
              step={1000}
              defaultValue={defaultValues.priceLong ?? 60000}
              className={inputClass + " pr-20"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
              XOF / jour
            </span>
          </div>
        </div>
      </div>

      {/* Disponibilité */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="available"
            defaultChecked={defaultValues.available ?? true}
            className="w-4 h-4 rounded accent-[#C8922A]"
          />
          <span className="text-sm font-medium text-slate-700">Véhicule disponible à la location</span>
        </label>
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2D2420] text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {submitLabel}
        </button>
        <a
          href="/dashboard/voitures"
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </a>
      </div>
    </form>
  );
}
