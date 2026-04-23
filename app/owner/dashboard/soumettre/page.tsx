"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitProperty } from "./_actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white";

export default function SoumettreePage() {
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router  = useRouter();

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 10);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await submitProperty(fd);
      setSuccess(true);
      setTimeout(() => router.push("/owner/dashboard/biens"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Bien soumis !</h2>
          <p className="text-slate-500">
            Votre bien a été soumis avec succès. Nous le vérifions sous 24-48h.
            Vous serez notifié par email dès sa publication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Soumettre un bien</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Votre bien sera vérifié par notre équipe avant publication (24-48h).
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Titre du bien <span className="text-red-400">*</span>
          </label>
          <input type="text" name="title" required placeholder="ex : Villa moderne 3 chambres, Cotonou"
            className={inputClass} />
        </div>

        {/* Type + Pays */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Type <span className="text-red-400">*</span></label>
            <select name="type" required className={inputClass}>
              <option value="appartement">Appartement</option>
              <option value="villa">Villa</option>
              <option value="bureau">Bureau</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pays <span className="text-red-400">*</span></label>
            <select name="country" required className={inputClass}>
              <option value="BENIN">Bénin</option>
              <option value="COTE_D_IVOIRE">Côte d&apos;Ivoire</option>
            </select>
          </div>
        </div>

        {/* Ville + Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville <span className="text-red-400">*</span></label>
            <input type="text" name="city" required placeholder="ex : Cotonou" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse <span className="text-red-400">*</span></label>
            <input type="text" name="address" required placeholder="ex : Quartier Fidjrossè" className={inputClass} />
          </div>
        </div>

        {/* Prix + Tarification */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Prix (XOF) <span className="text-red-400">*</span></label>
            <input type="number" name="price" required min="1" placeholder="ex : 25000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tarification</label>
            <select name="pricingType" className={inputClass}>
              <option value="night">Par nuit</option>
              <option value="month">Par mois</option>
            </select>
          </div>
        </div>

        {/* Chambres + SDB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Chambres <span className="text-red-400">*</span></label>
            <select name="bedrooms" required className={inputClass}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} chambre{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Salles de bain <span className="text-red-400">*</span></label>
            <select name="bathrooms" required className={inputClass}>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n} salle{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea name="description" required rows={4}
            placeholder="Décrivez votre bien : équipements, environnement, particularités..."
            className={`${inputClass} resize-none`} />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Photos <span className="text-slate-400 font-normal">(max 10, JPEG/PNG)</span>
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-[#0066CC] hover:bg-[#0066CC]/5 transition">
            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-slate-500">Cliquez pour sélectionner des photos</span>
            <input type="file" name="images" accept="image/*" multiple onChange={handleImages}
              className="hidden" />
          </label>
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {previews.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-20 w-full object-cover rounded-lg border border-slate-100" />
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition shadow-sm">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Soumission en cours…
            </>
          ) : "Soumettre pour validation"}
        </button>
      </form>
    </div>
  );
}
