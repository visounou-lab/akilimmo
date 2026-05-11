"use client";

import { ClipboardList, Video, CalendarCheck, BarChart3 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Vous soumettez votre bien",
    description:
      "Remplissez notre formulaire en ligne en quelques minutes. Décrivez votre bien, indiquez vos disponibilités et votre prix. C'est gratuit, sans engagement.",
  },
  {
    number: "02",
    icon: Video,
    title: "Nous créons votre annonce",
    description:
      "Notre équipe rédige l'annonce, collecte vos photos et vidéos, puis publie votre bien sur la plateforme AKIL IMMO sous 24 à 48 h ouvrées.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Nous gérons les réservations",
    description:
      "Les locataires nous contactent directement. Nous qualifions chaque demande, gérons les échanges et vous informons de chaque réservation confirmée.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Vous suivez vos revenus",
    description:
      "Depuis votre espace propriétaire, consultez en temps réel l'historique de vos réservations, vos paiements reçus et la performance de votre annonce.",
  },
];

export default function ProcessSteps() {
  return (
    <section
      aria-labelledby="process-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
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
            Le processus
          </p>

          <h2
            id="process-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            4 étapes, zéro stress.
          </h2>

          <p
            className="mt-5 mx-auto max-w-2xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "#6B5E52",
              lineHeight: 1.8,
            }}
          >
            De la soumission à l&apos;encaissement, AKIL IMMO prend en charge
            chaque étape pour que vous puissiez gérer votre bien depuis n&apos;importe où dans le monde.
          </p>
        </div>

        {/* Steps grid */}
        <ol className="grid gap-6 md:grid-cols-2" role="list">
          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <li key={number}>
              <div
                className="flex flex-col gap-5 rounded-2xl p-8 h-full transition-all duration-200"
                style={{
                  backgroundColor: "#F5F0E8",
                  border: "1px solid #E8DDD0",
                  boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 20px rgba(28,25,23,0.09)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#C8922A";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 8px rgba(28,25,23,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Step number pill */}
                  <span
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      color: "#C8922A",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {number}
                  </span>

                  {/* Icon container */}
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "rgba(200,146,42,0.12)",
                      border: "1px solid rgba(200,146,42,0.3)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={20} style={{ color: "#C8922A" }} />
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: "#1C1917",
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </p>
                </div>

                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 300,
                    color: "#6B5E52",
                    lineHeight: 1.75,
                  }}
                >
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
