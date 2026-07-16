"use client";

import { useEffect, useState, useCallback } from "react";

interface PendingLand {
  id: string;
  title: string;
  city: string;
  country: string;
  address: string;
  price: string;
  surface: number;
  titleType: string;
  serviced: boolean;
  description: string;
  imageUrl: string | null;
  images: string[];
  videoUrl: string | null;
  adminNote: string | null;
  createdAt: string;
  submitter: { name: string | null; email: string } | null;
  owner:     { name: string | null; email: string };
}

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const TITLE_LABEL: Record<string, string> = {
  TITRE_FONCIER: "Titre foncier",
  ACD: "ACD",
  LETTRE_ATTRIBUTION: "Lettre d'attribution",
  CONVENTION_VENTE: "Convention de vente",
  AUTRE: "Autre",
};

function formatDate(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
}
function formatPrice(n: string) {
  return new Intl.NumberFormat("fr-FR").format(Number(n));
}

export default function ValiderTerrainsPage() {
  const [lands, setLands]             = useState<PendingLand[]>([]);
  const [loading, setLoading]         = useState(true);
  const [actionId, setActionId]       = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; title: string } | null>(null);
  const [rejectNote, setRejectNote]   = useState("");
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/terrains/valider");
    if (res.ok) setLands(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function doAction(id: string, action: "publish" | "reject", note?: string) {
    setActionId(id);
    setActionError("");
    const res = await fetch(`/api/dashboard/terrains/valider/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setActionError(payload?.error ?? "Action impossible.");
    }
    setActionId(null);
    setRejectModal(null);
    setRejectNote("");
    await load();
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Terrains à valider</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {lands.length} terrain{lands.length !== 1 ? "s" : ""} en attente de révision
        </p>
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{actionError}</div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : lands.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-slate-600 font-medium">Aucun terrain en attente.</p>
          <p className="text-sm text-slate-400 mt-1">Tout est à jour. 🎉</p>
        </div>
      ) : (
        <div className="space-y-5">
          {lands.map((l) => {
            const cover = l.images[0] ?? l.imageUrl;
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="grid md:grid-cols-[220px_1fr] gap-0">
                  {/* Cover */}
                  <div className="h-48 md:h-full bg-slate-100">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={l.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300 text-xs">Pas de photo</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{l.title}</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {l.address}, {l.city} — {COUNTRY_LABEL[l.country] ?? l.country}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{formatDate(l.createdAt)}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-amber-50 text-amber-700 px-2.5 py-1 font-semibold">
                        {formatPrice(l.price)} XOF
                      </span>
                      <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-1">{l.surface} m²</span>
                      <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-1">
                        {TITLE_LABEL[l.titleType] ?? l.titleType}
                      </span>
                      {l.serviced && (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">Viabilisé</span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap line-clamp-4">{l.description}</p>

                    <p className="mt-3 text-xs text-slate-400">
                      Soumis par {(l.submitter ?? l.owner).name ?? "—"} · {(l.submitter ?? l.owner).email}
                    </p>

                    {l.images.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto">
                        {l.images.slice(0, 6).map((src, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={src} alt="" className="h-16 w-24 shrink-0 object-cover rounded-lg border border-slate-100" />
                        ))}
                      </div>
                    )}

                    {l.videoUrl && (
                      <a href={l.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs text-[#C8922A] hover:underline">
                        Voir la vidéo →
                      </a>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => doAction(l.id, "publish")}
                        disabled={actionId === l.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 text-sm font-semibold transition"
                      >
                        {actionId === l.id ? "…" : "Publier"}
                      </button>
                      <button
                        onClick={() => setRejectModal({ id: l.id, title: l.title })}
                        disabled={actionId === l.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 px-4 py-2 text-sm font-semibold transition"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-900">Refuser ce terrain</h3>
            <p className="text-sm text-slate-500 mt-1">« {rejectModal.title} »</p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={4}
              placeholder="Motif du refus (transmis au propriétaire)…"
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C8922A] resize-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectNote(""); }}
                className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => doAction(rejectModal.id, "reject", rejectNote)}
                disabled={!rejectNote.trim() || actionId === rejectModal.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition"
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
