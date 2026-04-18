"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Est-ce gratuit de s'inscrire ?",
    r: "Oui, l'inscription est entièrement gratuite. AKIL IMMO ne perçoit qu'une commission sur les réservations confirmées.",
  },
  {
    q: "Comment sont fixés les prix de location ?",
    r: "Vous proposez votre prix. Notre équipe peut vous conseiller sur le tarif optimal selon le marché local.",
  },
  {
    q: "Combien de temps avant que mon bien soit publié ?",
    r: "Après soumission, notre équipe vérifie votre bien et le publie sous 24 à 48 heures ouvrées.",
  },
  {
    q: "Comment sont gérées les réservations ?",
    r: "Les locataires nous contactent directement. Nous gérons la communication et vous informons de chaque réservation confirmée.",
  },
  {
    q: "Comment puis-je suivre mes revenus ?",
    r: "Votre dashboard propriétaire vous donne accès en temps réel à l'historique de vos réservations et de vos paiements.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ.map((item, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-semibold text-slate-800">{item.q}</span>
            <svg
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-slate-600 leading-relaxed">{item.r}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
