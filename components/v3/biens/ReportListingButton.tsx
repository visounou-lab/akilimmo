"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, X } from "lucide-react";

const reasons = [
  ["FAKE_LISTING", "Le logement semble inexistant"],
  ["SCAM_REQUEST", "Demande d’argent ou tentative d’arnaque"],
  ["WRONG_INFORMATION", "Informations ou photos trompeuses"],
  ["UNAVAILABLE", "Logement durablement indisponible"],
  ["OTHER", "Autre problème"],
] as const;

export default function ReportListingButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/property/${slug}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: data.get("reason"),
        details: data.get("details"),
        email: data.get("email"),
        website: data.get("website"),
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setError(payload?.error ?? "Signalement impossible.");
      return;
    }
    setSuccess(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setSuccess(false); setError(""); }}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6B5E52] underline decoration-red-300 underline-offset-4 transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
      >
        <Flag size={15} aria-hidden="true" />
        Signaler cette annonce
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] isolate flex items-center justify-center overflow-y-auto bg-black/65 p-3 sm:p-6"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-[#E7DDD2] bg-[#FDFCF8] p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Sécurité</p>
                <h2 id="report-title" className="mt-2 font-serif text-2xl font-bold text-[#1C1917]">
                  Signaler cette annonce
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5F554C]">{title}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-[#F5F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4D3E]"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            {success ? (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
                Signalement reçu. Notre équipe va l’examiner. Ne versez aucun argent si vous suspectez une fraude.
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#3D3530]">Motif *</span>
                  <select name="reason" required className="relative min-h-12 w-full cursor-pointer rounded-xl border border-[#DCCDBD] bg-[#FFFFFF] px-4 py-3 text-base text-[#1C1917] shadow-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20">
                    <option value="">Sélectionner</option>
                    {reasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#3D3530]">Expliquez le problème *</span>
                  <textarea name="details" required minLength={10} maxLength={1500} rows={5} className="relative block w-full rounded-xl border border-[#DCCDBD] bg-[#FFFFFF] px-4 py-3 text-base text-[#1C1917] shadow-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#3D3530]">Email de contact (facultatif)</span>
                  <input name="email" type="email" autoComplete="email" className="relative min-h-12 w-full rounded-xl border border-[#DCCDBD] bg-[#FFFFFF] px-4 py-3 text-base text-[#1C1917] shadow-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
                </label>
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button disabled={busy} className="min-h-12 w-full cursor-pointer rounded-xl bg-red-700 px-5 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {busy ? "Transmission…" : "Envoyer le signalement"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
