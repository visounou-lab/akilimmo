"use client";

import { useEffect, useState, useCallback } from "react";

interface PendingProperty {
  id: string;
  title: string;
  city: string;
  country: string;
  price: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  submitter: { name: string | null; email: string } | null;
  owner:     { name: string | null; email: string };
}

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

function formatDate(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
}

export default function ValiderPage() {
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading]        = useState(true);
  const [actionId, setActionId]      = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; title: string } | null>(null);
  const [rejectNote, setRejectNote]   = useState("");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/valider");
    if (res.ok) setProperties(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function doAction(id: string, action: "publish" | "reject", note?: string) {
    setActionId(id);
    await fetch(`/api/dashboard/valider/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    });
    setActionId(null);
    setRejectModal(null);
    setRejectNote("");
    await fetch_();
  }

  const owner = (p: PendingProperty) => p.submitter ?? p.owner;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Biens à valider</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {loading ? "…" : `${properties.length} bien${properties.length !== 1 ? "s" : ""} en attente de validation`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Chargement…</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Aucun bien en attente de validation.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-64 shrink-0 h-48 lg:h-auto bg-slate-100 relative">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                    En révision
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {COUNTRY_LABEL[p.country] ?? p.country} · {p.city} · Soumis le {formatDate(p.createdAt)}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Propriétaire : <span className="font-medium text-slate-700">{owner(p).name ?? "—"}</span>
                        {" "}<span className="text-slate-400">({owner(p).email})</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-[#0066CC]">
                        {new Intl.NumberFormat("fr-FR").format(Number(p.price))} XOF
                      </p>
                      <p className="text-xs text-slate-400">{p.bedrooms} ch. · {p.bathrooms} sdb</p>
                    </div>
                  </div>

                  {p.description && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-3">{p.description}</p>
                  )}

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => doAction(p.id, "publish")}
                      disabled={actionId === p.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition disabled:opacity-50"
                    >
                      {actionId === p.id ? "…" : "✅ Publier"}
                    </button>
                    <button
                      onClick={() => setRejectModal({ id: p.id, title: p.title })}
                      disabled={actionId === p.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition disabled:opacity-50"
                    >
                      ❌ Refuser
                    </button>
                    {p.videoUrl && (
                      <a href={p.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#0066CC] hover:underline">
                        Voir la vidéo →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Refuser le bien</h3>
            <p className="text-sm text-slate-500 mb-4">
              <strong>{rejectModal.title}</strong> — Saisissez la raison du refus. Elle sera envoyée au propriétaire.
            </p>
            <textarea
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="ex : Photos insuffisantes, description trop courte, adresse invalide…"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRejectModal(null); setRejectNote(""); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => rejectNote.trim() && doAction(rejectModal.id, "reject", rejectNote)}
                disabled={!rejectNote.trim() || !!actionId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
