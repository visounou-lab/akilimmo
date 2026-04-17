"use client";

import { useEffect, useState, useCallback } from "react";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending:   { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  active:    { label: "Actif",      classes: "bg-emerald-50 text-emerald-700" },
  suspended: { label: "Suspendu",   classes: "bg-red-50 text-red-600" },
};

interface Owner {
  id: string;
  name: string | null;
  email: string;
  country: string | null;
  city: string | null;
  phone: string | null;
  isVerified: boolean;
  status: string;
  createdAt: string;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
}

export default function ProprietairesPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOwners = useCallback(async () => {
    const res = await fetch("/api/dashboard/proprietaires");
    if (res.ok) setOwners(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchOwners(); }, [fetchOwners]);

  async function doAction(id: string, action: "activate" | "suspend") {
    setActionLoading(id + action);
    await fetch(`/api/dashboard/proprietaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await fetchOwners();
    setActionLoading(null);
  }

  const pending   = owners.filter((o) => o.status === "pending").length;
  const active    = owners.filter((o) => o.status === "active").length;
  const suspended = owners.filter((o) => o.status === "suspended").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Propriétaires</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestion des comptes propriétaires inscrits</p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "En attente", count: pending,   color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Actifs",     count: active,    color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Suspendus",  count: suspended, color: "bg-red-50 text-red-600 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
            <p className="text-3xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Chargement…</div>
        ) : owners.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Aucun propriétaire inscrit.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                {["Propriétaire", "Pays / Ville", "Téléphone", "Vérifié", "Statut", "Inscrit le", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {owners.map((o) => {
                const st = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#0066CC]">
                            {(o.name ?? o.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{o.name ?? "—"}</p>
                          <p className="text-xs text-slate-400 truncate">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {o.country ? COUNTRY_LABEL[o.country] ?? o.country : "—"}
                      {o.city ? <span className="text-slate-400"> · {o.city}</span> : null}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{o.phone ?? "—"}</td>
                    <td className="px-4 py-3.5">
                      {o.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Oui
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Non</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {o.status !== "active" && (
                          <button
                            onClick={() => doAction(o.id, "activate")}
                            disabled={actionLoading === o.id + "activate"}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition disabled:opacity-50"
                          >
                            {actionLoading === o.id + "activate" ? "…" : "✅ Activer"}
                          </button>
                        )}
                        {o.status !== "suspended" && (
                          <button
                            onClick={() => doAction(o.id, "suspend")}
                            disabled={actionLoading === o.id + "suspend"}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition disabled:opacity-50"
                          >
                            {actionLoading === o.id + "suspend" ? "…" : "🚫 Suspendre"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
