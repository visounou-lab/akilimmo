"use client";

import { useEffect, useState, useCallback } from "react";

interface PendingProperty {
  id: string;
  title: string;
  city: string;
  country: string;
  address: string;
  price: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  videoUrl: string | null;
  adminNote: string | null;
  createdAt: string;
  submitter: { name: string | null; email: string } | null;
  owner:     { name: string | null; email: string };
}

interface EditFields {
  title: string;
  description: string;
  country: string;
  city: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  videoUrl: string;
  adminNote: string;
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
  const [editId, setEditId]           = useState<string | null>(null);
  const [editFields, setEditFields]   = useState<EditFields | null>(null);
  const [saving, setSaving]           = useState(false);

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

  function openEdit(p: PendingProperty) {
    setEditId(p.id);
    setEditFields({
      title: p.title,
      description: p.description,
      country: p.country,
      city: p.city,
      address: p.address,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      videoUrl: p.videoUrl ?? "",
      adminNote: p.adminNote ?? "",
    });
  }

  function closeEdit() {
    setEditId(null);
    setEditFields(null);
  }

  async function saveEdit(id: string) {
    if (!editFields) return;
    setSaving(true);
    await fetch(`/api/dashboard/valider/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", ...editFields }),
    });
    setSaving(false);
    closeEdit();
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

                  {p.adminNote && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">Note admin</p>
                        <p className="text-xs text-amber-700">{p.adminNote}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => doAction(p.id, "publish")}
                      disabled={actionId === p.id || editId === p.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition disabled:opacity-50"
                    >
                      {actionId === p.id ? "…" : "✅ Publier"}
                    </button>
                    <button
                      onClick={() => { setRejectModal({ id: p.id, title: p.title }); setRejectNote(p.adminNote ?? ""); }}
                      disabled={actionId === p.id || editId === p.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition disabled:opacity-50"
                    >
                      ❌ Refuser
                    </button>
                    <button
                      onClick={() => editId === p.id ? closeEdit() : openEdit(p)}
                      disabled={!!actionId}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition disabled:opacity-50"
                    >
                      {editId === p.id ? "✖ Fermer" : "✏️ Modifier"}
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

              {/* Inline edit form */}
              {editId === p.id && editFields && (
                <div className="border-t border-gray-100 bg-slate-50 p-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Modifier le bien</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Titre</label>
                      <input
                        type="text"
                        value={editFields.title}
                        onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Pays</label>
                      <select
                        value={editFields.country}
                        onChange={(e) => setEditFields({ ...editFields, country: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
                      >
                        <option value="BENIN">Bénin</option>
                        <option value="COTE_D_IVOIRE">Côte d&apos;Ivoire</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Ville</label>
                      <input
                        type="text"
                        value={editFields.city}
                        onChange={(e) => setEditFields({ ...editFields, city: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Adresse</label>
                      <input
                        type="text"
                        value={editFields.address}
                        onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Prix (XOF / mois)</label>
                      <input
                        type="number"
                        value={editFields.price}
                        onChange={(e) => setEditFields({ ...editFields, price: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Lien vidéo</label>
                      <input
                        type="url"
                        value={editFields.videoUrl}
                        onChange={(e) => setEditFields({ ...editFields, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/…"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Chambres</label>
                      <input
                        type="number"
                        min={0}
                        value={editFields.bedrooms}
                        onChange={(e) => setEditFields({ ...editFields, bedrooms: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Salles de bain</label>
                      <input
                        type="number"
                        min={0}
                        value={editFields.bathrooms}
                        onChange={(e) => setEditFields({ ...editFields, bathrooms: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                      <textarea
                        rows={4}
                        value={editFields.description}
                        onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-amber-600 mb-1">Note admin (optionnel — visible par le propriétaire en cas de refus)</label>
                      <textarea
                        rows={2}
                        value={editFields.adminNote}
                        onChange={(e) => setEditFields({ ...editFields, adminNote: e.target.value })}
                        placeholder="ex : Photos insuffisantes, veuillez ajouter des photos de la chambre principale…"
                        className="w-full rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={closeEdit}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => saveEdit(p.id)}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0055AA] disabled:opacity-50 text-white text-sm font-semibold transition"
                    >
                      {saving ? "Enregistrement…" : "Enregistrer les modifications"}
                    </button>
                  </div>
                </div>
              )}
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
