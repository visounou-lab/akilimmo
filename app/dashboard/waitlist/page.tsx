"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

interface Entry {
  id: string;
  email: string;
  source: string;
  country: string | null;
  createdAt: string;
}

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const SOURCE_LABEL: Record<string, string> = {
  sejours: "Séjours",
  home: "Accueil",
  terrains: "Terrains",
};

function formatDate(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource]   = useState("TOUS");
  const [copied, setCopied]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/waitlist");
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const sources = useMemo(
    () => ["TOUS", ...Array.from(new Set(entries.map((e) => e.source)))],
    [entries],
  );
  const filtered = useMemo(
    () => (source === "TOUS" ? entries : entries.filter((e) => e.source === source)),
    [entries, source],
  );

  function copyEmails() {
    const text = filtered.map((e) => e.email).join(", ");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Liste d&apos;attente</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} inscrit{filtered.length !== 1 ? "s" : ""} à recontacter au lancement
          </p>
        </div>
        {filtered.length > 0 && (
          <button
            onClick={copyEmails}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1C1917] hover:bg-[#2D2420] text-white px-4 py-2.5 text-sm font-semibold transition"
          >
            {copied ? "Emails copiés ✓" : "Copier tous les emails"}
          </button>
        )}
      </div>

      {/* Filtre source */}
      {sources.length > 2 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {sources.map((s) => {
            const active = source === s;
            return (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  active ? "bg-[#C8922A] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "TOUS" ? "Toutes sources" : SOURCE_LABEL[s] ?? s}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-slate-600 font-medium">Aucun inscrit pour l&apos;instant.</p>
          <p className="text-sm text-slate-400 mt-1">Les emails laissés sur les offres « Bientôt » apparaîtront ici.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Pays</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <a href={`mailto:${e.email}`} className="hover:text-[#C8922A]">{e.email}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{SOURCE_LABEL[e.source] ?? e.source}</td>
                  <td className="px-4 py-3 text-slate-500">{e.country ? COUNTRY_LABEL[e.country] ?? e.country : "—"}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
