"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
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
    <section
      aria-labelledby="faq-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="mx-auto mb-5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A" }} />
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                backgroundColor: "#C8922A",
                borderRadius: "50%",
              }}
            />
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A" }} />
          </div>

          <p
            className="mb-4 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.16em",
            }}
          >
            Questions fréquentes
          </p>

          <h2
            id="faq-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Vous avez des questions ?
          </h2>
        </div>

        {/* Accordion */}
        <dl className="space-y-3">
          {FAQS.map(({ q, r }, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                style={{
                  border: `1.5px solid ${isOpen ? "#C8922A" : "#E8DDD0"}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  transition: "border-color 200ms",
                }}
              >
                <dt>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 cursor-pointer text-left"
                    style={{
                      backgroundColor: "#F5F0E8",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: "#1C1917",
                    }}
                  >
                    <span>{q}</span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      style={{
                        color: "#C8922A",
                        flexShrink: 0,
                        transition: "transform 200ms",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                </dt>
                {isOpen && (
                  <dd
                    className="px-6 pb-5"
                    style={{
                      backgroundColor: "#FDFCF8",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      color: "#6B5E52",
                      lineHeight: 1.75,
                    }}
                  >
                    {r}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
