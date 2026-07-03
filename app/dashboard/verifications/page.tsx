"use client";

import { useCallback, useEffect, useState } from "react";

type VerificationCase = {
  id: string;
  type: "IDENTITY" | "OWNER_AUTHORITY" | "PROFESSIONAL";
  status: string;
  submittedAt: string | null;
  subjectUser: {
    name: string | null;
    email: string;
    phone: string | null;
    country: string | null;
    city: string | null;
    requestedRole: "OWNER" | "AGENT" | null;
  };
  documents: {
    id: string;
    type: string;
    originalName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    createdAt: string;
  }[];
};

const CASE_LABELS = {
  IDENTITY: "Identité",
  OWNER_AUTHORITY: "Droit sur le bien",
  PROFESSIONAL: "Qualité professionnelle",
};

const DOCUMENT_LABELS: Record<string, string> = {
  IDENTITY_DOCUMENT: "Pièce d’identité",
  OWNERSHIP_EVIDENCE: "Preuve de propriété",
  MANAGEMENT_MANDATE: "Mandat de gestion",
  PROFESSIONAL_CARD: "Carte professionnelle",
  BUSINESS_REGISTRATION: "Registre du commerce",
  TAX_REGISTRATION: "Immatriculation fiscale",
  PROFESSIONAL_INSURANCE: "Assurance professionnelle",
};

export default function VerificationsPage() {
  const [cases, setCases] = useState<VerificationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadCases = useCallback(async () => {
    setError("");
    const response = await fetch("/api/dashboard/verifications", { cache: "no-store" });
    if (response.ok) {
      setCases(await response.json());
    } else {
      setError("Impossible de charger les dossiers.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  async function review(id: string, action: "approve" | "reject") {
    let reason: string | undefined;
    if (action === "reject") {
      reason = window.prompt("Expliquez précisément ce que le candidat doit corriger :")?.trim();
      if (!reason) return;
    } else if (!window.confirm("Confirmer l’approbation de ce contrôle ?")) {
      return;
    }

    setBusyId(id);
    setError("");
    const response = await fetch(`/api/dashboard/verifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "La décision n’a pas pu être enregistrée.");
    } else {
      await loadCases();
    }
    setBusyId(null);
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Vérifications</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Contrôle confidentiel des identités, mandats et justificatifs professionnels.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Chargement des dossiers…</p>
      ) : cases.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-semibold text-slate-800">Aucun contrôle en attente</p>
          <p className="mt-1 text-sm text-slate-500">Les nouveaux dossiers apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {cases.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {CASE_LABELS[item.type]}
                  </span>
                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    {item.subjectUser.name ?? "Nom non renseigné"}
                  </h2>
                  <p className="text-sm text-slate-500">{item.subjectUser.email}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {item.subjectUser.requestedRole === "AGENT" ? "Agent" : "Propriétaire"}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div>
                  <dt className="text-slate-400">Téléphone</dt>
                  <dd className="font-medium text-slate-700">{item.subjectUser.phone ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Localisation</dt>
                  <dd className="font-medium text-slate-700">
                    {[item.subjectUser.city, item.subjectUser.country].filter(Boolean).join(", ") || "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 space-y-2">
                {item.documents.map((document) => (
                  <a
                    key={document.id}
                    href={`/api/dashboard/verifications/documents/${document.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition-colors duration-200 hover:border-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  >
                    <span className="font-medium text-slate-700">
                      {DOCUMENT_LABELS[document.type] ?? document.type}
                    </span>
                    <span className="text-emerald-700">Consulter ↗</span>
                  </a>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void review(item.id, "approve")}
                  className="min-h-11 cursor-pointer rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Approuver ce contrôle
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void review(item.id, "reject")}
                  className="min-h-11 cursor-pointer rounded-xl border border-red-200 px-5 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Demander une correction
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
