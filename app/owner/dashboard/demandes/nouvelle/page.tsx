"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

const DOC_TYPES = [
  { value: "quittance",   label: "Quittance de loyer",       desc: "Justificatif de paiement du loyer" },
  { value: "contrat",     label: "Contrat de location",      desc: "Copie de votre bail en cours" },
  { value: "attestation", label: "Attestation de propriété", desc: "Document officiel de propriété" },
];

type Property = { id: string; title: string };
type Status = "idle" | "loading" | "success" | "error";

function NouvelleDemandeForm() {
  const params   = useSearchParams();
  const router   = useRouter();
  const [type, setType]       = useState(params.get("type") ?? "quittance");
  const [propertyId, setProp] = useState("");
  const [message, setMessage] = useState("");
  const [properties, setProps] = useState<Property[]>([]);
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setError]  = useState("");

  useEffect(() => {
    fetch("/api/owner/properties")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: Property[]) => setProps(data))
      .catch(() => {/* non-blocking */});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/owner/documents", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type, propertyId: propertyId || undefined, message: message || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur serveur");
      }
      setStatus("success");
      setTimeout(() => router.push("/owner/dashboard/demandes"), 2000);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-green-100 p-10 text-center max-w-md mx-auto mt-8">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-800 font-semibold mb-1">Demande envoyée !</p>
        <p className="text-slate-500 text-sm">Votre conseiller a été notifié. Vous serez redirigé…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Type de document</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {DOC_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={[
                "text-left rounded-xl border-2 p-4 transition-all",
                type === t.value
                  ? "border-[#0066CC] bg-[#0066CC]/5"
                  : "border-slate-200 hover:border-slate-300 bg-white",
              ].join(" ")}
            >
              <p className={`text-sm font-semibold ${type === t.value ? "text-[#0066CC]" : "text-slate-800"}`}>
                {t.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Property selector (optional) */}
      {properties.length > 0 && (
        <div>
          <label htmlFor="property" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Bien concerné <span className="font-normal text-slate-400">(optionnel)</span>
          </label>
          <select
            id="property"
            value={propertyId}
            onChange={(e) => setProp(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC] bg-white"
          >
            <option value="">— Aucun bien spécifique —</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Message <span className="font-normal text-slate-400">(optionnel)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Précisions supplémentaires pour votre conseiller…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC]"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-[#0066CC] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#004499] disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Envoi…
            </>
          ) : "Envoyer la demande"}
        </button>
        <Link
          href="/owner/dashboard/demandes"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

export default function NouvelleDemandePage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/owner/dashboard/demandes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Mes demandes
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nouvelle demande</h1>
        <p className="text-sm text-slate-500 mt-0.5">Votre conseiller traitera votre demande sous 24-48h.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <Suspense>
          <NouvelleDemandeForm />
        </Suspense>
      </div>
    </div>
  );
}
