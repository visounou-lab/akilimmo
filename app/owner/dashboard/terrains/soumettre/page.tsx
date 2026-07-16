"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitLand } from "./_actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#C8922A] focus:ring-2 focus:ring-[rgba(200,146,42,0.2)] transition bg-white";

export default function SoumettreTerrainPage() {
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
      await submitLand(fd);
      setSuccess(true);
      setTimeout(() => router.push("/owner/dashboard/terrains"), 2500);
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
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Terrain soumis !</h2>
          <p className="text-slate-500">
            Votre terrain a été soumis avec succès. Nous le vérifions sous 24-48h.
            Vous serez notifié par email dès sa publication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mettre un terrain en vente</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Votre terrain sera vérifié par notre équipe avant publication (24-48h).
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Titre de l&apos;annonce <span className="text-red-400">*</span>
          </label>
          <input type="text" name="title" required placeholder="ex : Terrain 500 m² viabilisé, Calavi"
            className={inputClass} />
        </div>

        {/* Pays + Statut juridique */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pays <span className="text-red-400">*</span></label>
            <select name="country" required className={inputClass}>
              <option value="BENIN">Bénin</option>
              <option value="COTE_D_IVOIRE">Côte d&apos;Ivoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Statut juridique <span className="text-red-400">*</span></label>
            <select name="titleType" required className={inputClass}>
              <option value="TITRE_FONCIER">Titre foncier</option>
              <option value="ACD">ACD (Attestation de Cession Définitive)</option>
              <option value="LETTRE_ATTRIBUTION">Lettre d&apos;attribution</option>
              <option value="CONVENTION_VENTE">Convention de vente</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
        </div>

        {/* Ville + Adresse */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville <span className="text-red-400">*</span></label>
            <input type="text" name="city" required placeholder="ex : Abomey-Calavi" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Quartier / Localisation <span className="text-red-400">*</span></label>
            <input type="text" name="address" required placeholder="ex : Zopah, non loin du carrefour" className={inputClass} />
          </div>
        </div>

        {/* Prix + Superficie */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Prix de vente total (XOF) <span className="text-red-400">*</span></label>
            <input type="number" name="price" required min="1" placeholder="ex : 15000000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Superficie (m²) <span className="text-red-400">*</span></label>
            <input type="number" name="surface" required min="1" placeholder="ex : 500" className={inputClass} />
          </div>
        </div>

        {/* Viabilisé */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <input type="checkbox" name="serviced" id="serviced"
            className="h-4 w-4 rounded border-slate-300 text-[#C8922A] focus:ring-[#C8922A]" />
          <label htmlFor="serviced" className="text-sm text-slate-700">
            Terrain viabilisé <span className="text-slate-400">(eau / électricité à proximité)</span>
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea name="description" required rows={4}
            placeholder="Décrivez le terrain : dimensions, accès, environnement, documents disponibles..."
            className={`${inputClass} resize-none`} />
        </div>

        {/* Vidéo (optionnel) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Lien vidéo YouTube <span className="text-slate-400 font-normal">(optionnel)</span>
          </label>
          <input type="url" name="videoUrl" placeholder="https://youtube.com/..." className={inputClass} />
        </div>

        {/* ── Vérification du titre ── */}
        <div className="rounded-2xl border border-[#C8922A]/30 bg-[rgba(200,146,42,0.05)] p-5 space-y-4">
          <div className="flex items-start gap-2.5">
            <svg className="w-5 h-5 text-[#C8922A] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-slate-800">Faites vérifier votre titre — vendez plus vite</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Les terrains avec titre vérifié inspirent bien plus confiance aux acheteurs.
                Vos documents restent <strong>strictement confidentiels</strong> : jamais publiés, consultés uniquement par notre équipe de vérification.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Référence du titre <span className="text-slate-400 font-normal">(optionnel)</span>
            </label>
            <input type="text" name="titleRef" placeholder="ex : TF n°1234 RB / Cotonou" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Documents du titre <span className="text-slate-400 font-normal">(privé — PDF, JPEG ou PNG, max 8 Mo)</span>
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#C8922A]/40 rounded-xl p-6 cursor-pointer hover:bg-[rgba(200,146,42,0.06)] transition">
              <svg className="w-7 h-7 text-[#C8922A] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-slate-500">Titre foncier, ACD, plan de bornage, convention…</span>
              <input type="file" name="titleDocs" accept="application/pdf,image/jpeg,image/png" multiple className="hidden" />
            </label>
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Photos <span className="text-slate-400 font-normal">(max 10, JPEG/PNG)</span>
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-[#C8922A] hover:bg-[rgba(200,146,42,0.05)] transition">
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1917] hover:bg-[#2D2420] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition shadow-sm">
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
