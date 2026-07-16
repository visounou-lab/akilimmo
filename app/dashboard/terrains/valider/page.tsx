"use client";

import { useEffect, useState, useCallback } from "react";

interface LandDoc {
  id: string;
  type: string;
  originalName: string | null;
  mimeType: string | null;
  createdAt: string;
}

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
  titleVerification: string;
  titleRef: string | null;
  titleVerificationNote: string | null;
  documents: LandDoc[];
  submitter: { name: string | null; email: string } | null;
  owner:     { name: string | null; email: string };
}

const TITLE_VERIF_META: Record<string, { label: string; bg: string; text: string }> = {
  UNVERIFIED: { label: "Titre non vérifié", bg: "bg-slate-100",  text: "text-slate-500"   },
  PENDING:    { label: "Titre à contrôler", bg: "bg-amber-50",   text: "text-amber-700"   },
  VERIFIED:   { label: "Titre vérifié",     bg: "bg-emerald-50", text: "text-emerald-700" },
  REJECTED:   { label: "Titre rejeté",      bg: "bg-red-50",     text: "text-red-600"     },
};

const DOC_TYPE_LABEL: Record<string, string> = {
  TITLE_DEED:     "Titre foncier / ACD",
  SURVEY_PLAN:    "Plan de bornage",
  SALE_AGREEMENT: "Convention de vente",
  OWNER_ID:       "Pièce du vendeur",
  OTHER:          "Autre document",
};

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
  const [titleModal, setTitleModal]   = useState<{ id: string; title: string; ref: string } | null>(null);
  const [titleRef, setTitleRef]       = useState("");
  const [titleNote, setTitleNote]     = useState("");
  const [openingDoc, setOpeningDoc]   = useState<string | null>(null);

  async function openDoc(docId: string) {
    setOpeningDoc(docId);
    setActionError("");
    try {
      const res = await fetch(`/api/dashboard/terrains/documents/${docId}`);
      const payload = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (res.ok && payload?.url) window.open(payload.url, "_blank", "noopener,noreferrer");
      else setActionError(payload?.error ?? "Impossible d'ouvrir le document.");
    } finally {
      setOpeningDoc(null);
    }
  }

  async function verifyTitle(id: string, ref: string, note: string) {
    setActionId(id);
    setActionError("");
    const res = await fetch(`/api/dashboard/terrains/valider/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify_title", titleRef: ref, note }),
    });
    if (!res.ok) {
      const p = (await res.json().catch(() => null)) as { error?: string } | null;
      setActionError(p?.error ?? "Action impossible.");
    }
    setActionId(null);
    setTitleModal(null);
    setTitleRef("");
    setTitleNote("");
    await load();
  }

  async function rejectTitle(id: string) {
    setActionId(id);
    const res = await fetch(`/api/dashboard/terrains/valider/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject_title" }),
    });
    if (!res.ok) {
      const p = (await res.json().catch(() => null)) as { error?: string } | null;
      setActionError(p?.error ?? "Action impossible.");
    }
    setActionId(null);
    await load();
  }

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

                    {/* ── Vérification du titre ── */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vérification du titre</span>
                        {(() => {
                          const meta = TITLE_VERIF_META[l.titleVerification] ?? TITLE_VERIF_META.UNVERIFIED;
                          return (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}>
                              {meta.label}
                            </span>
                          );
                        })()}
                      </div>

                      {l.titleRef && (
                        <p className="text-xs text-slate-600 mb-2">Référence déclarée : <strong>{l.titleRef}</strong></p>
                      )}
                      {l.titleVerificationNote && (
                        <p className="text-xs text-slate-500 mb-2 italic">« {l.titleVerificationNote} »</p>
                      )}

                      {/* Documents privés */}
                      {l.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {l.documents.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => openDoc(d.id)}
                              disabled={openingDoc === d.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:border-[#C8922A] hover:text-[#C8922A] transition disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {openingDoc === d.id ? "Ouverture…" : DOC_TYPE_LABEL[d.type] ?? "Document"}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mb-3">Aucun document fourni par le vendeur.</p>
                      )}

                      {/* Actions titre */}
                      {l.titleVerification !== "VERIFIED" && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => { setTitleModal({ id: l.id, title: l.title, ref: l.titleRef ?? "" }); setTitleRef(l.titleRef ?? ""); setTitleNote(""); }}
                            disabled={actionId === l.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-3 py-1.5 text-xs font-semibold transition"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                            </svg>
                            Marquer titre vérifié
                          </button>
                          {l.titleVerification !== "REJECTED" && (
                            <button
                              onClick={() => rejectTitle(l.id)}
                              disabled={actionId === l.id}
                              className="text-xs text-red-500 hover:underline disabled:opacity-50"
                            >
                              Signaler incohérence
                            </button>
                          )}
                        </div>
                      )}
                    </div>

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

      {/* Title verification modal */}
      {titleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-900">Marquer le titre comme vérifié</h3>
            <p className="text-sm text-slate-500 mt-1">« {titleModal.title} »</p>
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-3">
              Ne validez qu&apos;après contrôle réel des documents. Ces informations seront visibles par les acheteurs.
            </p>

            <label className="block text-sm font-medium text-slate-700 mt-4 mb-1.5">Référence du titre contrôlée</label>
            <input
              value={titleRef}
              onChange={(e) => setTitleRef(e.target.value)}
              placeholder="ex : TF n°1234 RB / Cotonou"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8922A]"
            />

            <label className="block text-sm font-medium text-slate-700 mt-4 mb-1.5">Ce qui a été contrôlé <span className="text-slate-400 font-normal">(visible acheteur)</span></label>
            <textarea
              value={titleNote}
              onChange={(e) => setTitleNote(e.target.value)}
              rows={3}
              placeholder="ex : Titre foncier confirmé, concordance du nom du vendeur, terrain non grevé."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-[#C8922A] resize-none"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setTitleModal(null); setTitleRef(""); setTitleNote(""); }}
                className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => verifyTitle(titleModal.id, titleRef, titleNote)}
                disabled={actionId === titleModal.id}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                Confirmer la vérification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
