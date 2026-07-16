"use client";

import { useEffect, useState, useCallback } from "react";

interface Inquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  land: { title: string; slug: string; city: string } | null;
}

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: "Nouveau",   bg: "bg-amber-50",   text: "text-amber-700"   },
  contacted: { label: "Contacté",  bg: "bg-blue-50",    text: "text-blue-700"    },
  closed:    { label: "Clôturé",   bg: "bg-slate-100",  text: "text-slate-500"   },
};

function formatDate(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(d));
}

export default function TerrainDemandesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [busyId, setBusyId]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/terrains/demandes");
    if (res.ok) setInquiries(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    await fetch(`/api/dashboard/terrains/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    await load();
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Demandes — Terrains</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {inquiries.length} demande{inquiries.length !== 1 ? "s" : ""} d&apos;acheteurs
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-slate-600 font-medium">Aucune demande pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Terrain</th>
                <th className="px-4 py-3 font-medium">Acheteur</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((q) => {
                const st = STATUS_META[q.status] ?? STATUS_META.pending;
                return (
                  <tr key={q.id} className="border-b border-slate-50 last:border-0 align-top">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(q.createdAt)}</td>
                    <td className="px-4 py-3">
                      {q.land ? (
                        <a href={`/terrains/${q.land.slug}`} target="_blank" rel="noopener noreferrer"
                          className="font-medium text-slate-800 hover:text-[#C8922A]">
                          {q.land.title}
                          <span className="block text-xs text-slate-400">{q.land.city}</span>
                        </a>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{q.clientName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`tel:${q.clientPhone}`} className="hover:text-[#C8922A]">{q.clientPhone}</a>
                      {q.clientEmail && <span className="block text-xs text-slate-400">{q.clientEmail}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">
                      {q.message ? <span className="line-clamp-3">{q.message}</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {q.status !== "contacted" && (
                        <button onClick={() => setStatus(q.id, "contacted")} disabled={busyId === q.id}
                          className="text-xs text-blue-600 hover:underline disabled:opacity-50">Contacté</button>
                      )}
                      {q.status !== "closed" && (
                        <button onClick={() => setStatus(q.id, "closed")} disabled={busyId === q.id}
                          className="ml-3 text-xs text-slate-400 hover:underline disabled:opacity-50">Clôturer</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
