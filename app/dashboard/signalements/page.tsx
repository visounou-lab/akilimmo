"use client";

import { useCallback, useEffect, useState } from "react";

type Report = {
  id: string;
  reason: string;
  details: string | null;
  priority: string;
  status: string;
  reporterEmail: string | null;
  createdAt: string;
  property: {
    slug: string;
    title: string;
    city: string;
    publishStatus: string;
    owner: { id: string; name: string | null; email: string; status: string };
    submitter: { id: string; name: string | null; email: string; status: string } | null;
  };
};

const LABELS: Record<string, string> = {
  FAKE_LISTING: "Logement potentiellement inexistant",
  SCAM_REQUEST: "Suspicion d’arnaque ou demande d’argent",
  WRONG_INFORMATION: "Informations trompeuses",
  UNAVAILABLE: "Logement indisponible",
  OTHER: "Autre problème",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/dashboard/signalements", { cache: "no-store" });
    if (response.ok) setReports(await response.json());
    else setError("Chargement impossible.");
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function act(id: string, action: "review" | "dismiss" | "suspend") {
    let resolution: string | undefined;
    if (action !== "review") {
      resolution = window.prompt(
        action === "suspend" ? "Motif de suspension de l’annonce :" : "Pourquoi classer ce signalement ?",
      )?.trim();
      if (!resolution) return;
    }
    setBusy(id);
    setError("");
    const response = await fetch(`/api/dashboard/signalements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, resolution }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Action impossible.");
    } else {
      await load();
    }
    setBusy(null);
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Signalements</h1>
      <p className="mt-1 text-sm text-slate-500">Examen des annonces potentiellement frauduleuses ou trompeuses.</p>
      {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Chargement…</p>
      ) : reports.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">Aucun signalement ouvert.</div>
      ) : (
        <div className="mt-8 space-y-5">
          {reports.map((report) => {
            const publisher = report.property.submitter ?? report.property.owner;
            return (
              <article key={report.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${report.priority === "HIGH" ? "border-red-300" : "border-slate-200"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${report.priority === "HIGH" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                      {report.priority === "HIGH" ? "Priorité haute" : "À examiner"}
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-slate-900">{LABELS[report.reason] ?? report.reason}</h2>
                    <a href={`/biens/${report.property.slug}`} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-[#1B4D3E] underline">
                      {report.property.title} · {report.property.city}
                    </a>
                  </div>
                  <time className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleString("fr-FR")}</time>
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{report.details}</p>
                <div className="mt-4 text-sm text-slate-500">
                  Publié par <strong className="text-slate-700">{publisher.name ?? publisher.email}</strong>
                  {report.reporterEmail && <> · Contact du déclarant : {report.reporterEmail}</>}
                </div>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  <button disabled={busy === report.id} onClick={() => void act(report.id, "review")} className="min-h-11 cursor-pointer rounded-xl border border-slate-300 px-4 text-sm font-semibold">Prendre en charge</button>
                  <button disabled={busy === report.id} onClick={() => void act(report.id, "dismiss")} className="min-h-11 cursor-pointer rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700">Classer sans suite</button>
                  <button disabled={busy === report.id} onClick={() => void act(report.id, "suspend")} className="min-h-11 cursor-pointer rounded-xl bg-red-700 px-4 text-sm font-semibold text-white">Suspendre l’annonce</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
