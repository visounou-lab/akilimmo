"use client";

import { useEffect, useRef, useState } from "react";

interface Owner {
  id: string;
  name: string | null;
  email: string;
  country: string | null;
  city: string | null;
}

const TEMPLATES = [
  {
    label: "Bienvenue + déposer un bien",
    subject: "Bienvenue sur AKIL IMMO — déposez votre premier bien",
    body: `Votre compte propriétaire est actif et votre espace est prêt à être utilisé.

Des milliers de locataires potentiels cherchent un logement en Côte d'Ivoire et au Bénin — votre bien peut être en ligne dès aujourd'hui.

Pour soumettre votre premier bien, rendez-vous ici :
https://www.akilimmo.com/owner/dashboard/soumettre

La soumission prend moins de 5 minutes. Notre équipe vérifie et met en ligne sous 24 à 48 heures.

N'hésitez pas à nous contacter pour toute question.`,
  },
  {
    label: "Relance — bien en attente",
    subject: "Votre bien est en cours de vérification",
    body: `Nous avons bien reçu votre bien et notre équipe est en train de le vérifier.

Vous recevrez une notification dès qu'il sera mis en ligne (sous 24 à 48 heures).

Si vous avez des questions ou souhaitez apporter des précisions, répondez simplement à cet email.`,
  },
  {
    label: "Rappel — compléter le profil",
    subject: "Complétez votre profil pour mieux vous présenter",
    body: `Afin d'offrir la meilleure expérience aux locataires, nous vous invitons à compléter votre profil propriétaire.

Ajoutez votre numéro de téléphone et votre ville pour que les locataires puissent vous contacter facilement.

Rendez-vous ici : https://www.akilimmo.com/owner/dashboard/profil`,
  },
];

export default function MessagesPage() {
  const [owners, setOwners]     = useState<Owner[]>([]);
  const [ownerId, setOwnerId]   = useState("");
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/dashboard/proprietaires")
      .then((r) => r.json())
      .then((data) => setOwners(Array.isArray(data) ? data : []))
      .catch(() => setOwners([]));
  }, []);

  function applyTemplate(t: typeof TEMPLATES[0]) {
    setSubject(t.subject);
    setBody(t.body);
    setTimeout(() => bodyRef.current?.focus(), 50);
  }

  async function handleSend() {
    setError("");
    if (!ownerId) { setError("Sélectionnez un propriétaire"); return; }
    if (!subject.trim()) { setError("L'objet est requis"); return; }
    if (!body.trim()) { setError("Le message est requis"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setSuccess(true);
      setOwnerId(""); setSubject(""); setBody("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const selectedOwner = owners.find((o) => o.id === ownerId);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Envoyer un message</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Le message est envoyé par email et apparaît dans les notifications de l&apos;espace propriétaire.
        </p>
      </div>

      <div className="space-y-5">
        {/* Destinataire */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Destinataire <span className="text-red-400">*</span>
          </label>
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 bg-white"
          >
            <option value="">Sélectionner un propriétaire…</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name ?? "Sans nom"} — {o.email}{o.city ? ` (${o.city})` : ""}
              </option>
            ))}
          </select>
          {selectedOwner && (
            <p className="mt-1.5 text-xs text-slate-400">
              Email : {selectedOwner.email}
            </p>
          )}
        </div>

        {/* Templates */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Modèles rapides</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t)}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-[#0066CC] hover:text-[#0066CC] hover:bg-[#0066CC]/5 transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Objet */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Objet <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ex : Bienvenue sur AKIL IMMO"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 bg-white"
          />
        </div>

        {/* Corps */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Écrivez votre message ici…"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 bg-white resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            La signature &quot;L&apos;équipe AKIL IMMO&quot; est ajoutée automatiquement.
          </p>
        </div>

        {/* Aperçu notification */}
        {(subject || body) && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Aperçu notification</p>
            <div className="bg-white rounded-lg border border-slate-100 p-3 flex gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0066CC] mt-1.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Message
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{subject || "—"}</p>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{body || "—"}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Message envoyé — email + notification créés.
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3 text-sm font-semibold transition shadow-sm"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi en cours…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Envoyer le message
            </>
          )}
        </button>
      </div>
    </div>
  );
}
