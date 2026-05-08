"use client";

import { Search, Video, FileSignature } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Vous choisissez en ligne",
    description:
      "Parcourez nos biens depuis où vous êtes. Photos HD, plans, quartier, prix — tout est transparent. Zéro déplacement nécessaire.",
    ariaLabel: "Étape 1 : choisissez votre bien en ligne",
  },
  {
    icon: Video,
    step: "02",
    title: "Nous visitons pour vous",
    description:
      "Votre conseiller AKIL IMMO se déplace sur place, filme la visite en direct et répond à toutes vos questions en temps réel.",
    ariaLabel: "Étape 2 : nous effectuons la visite virtuelle pour vous",
  },
  {
    icon: FileSignature,
    step: "03",
    title: "Vous signez à distance",
    description:
      "Contrat électronique sécurisé, transfert encadré, remise de clés coordonnée. Vous signez depuis Paris, Madrid ou Montréal.",
    ariaLabel: "Étape 3 : signature du contrat à distance",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="hiw-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#F0FDFA" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="mb-3 text-xs font-semibold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              color: "#14B8A6",
            }}
          >
            Simple · Transparent · Sécurisé
          </p>
          <h2
            id="hiw-heading"
            className="text-3xl sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontWeight: 700,
              color: "#134E4A",
              letterSpacing: "-0.02em",
            }}
          >
            Comment ça marche ?
          </h2>
          <p
            className="mt-4 mx-auto max-w-xl text-base leading-relaxed"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              fontWeight: 300,
              color: "#134E4A",
              opacity: 0.75,
            }}
          >
            Trois étapes claires pour investir au pays sans jamais quitter votre
            ville de résidence.
          </p>
        </div>

        {/* Steps */}
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-14 left-1/4 right-1/4 h-px"
            style={{ backgroundColor: "#14B8A6", opacity: 0.35 }}
            aria-hidden="true"
          />

          {STEPS.map(({ icon: Icon, step, title, description, ariaLabel }) => (
            <li
              key={step}
              aria-label={ariaLabel}
              className="relative flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-200 cursor-default"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 10px 15px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 6px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              {/* Step number */}
              <span
                className="absolute -top-3 text-xs font-bold tracking-widest"
                style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  color: "#0369A1",
                  backgroundColor: "#F0FDFA",
                  padding: "2px 10px",
                  borderRadius: "999px",
                  border: "1px solid #14B8A6",
                }}
                aria-hidden="true"
              >
                {step}
              </span>

              {/* Icon */}
              <div
                className="mb-5 flex items-center justify-center rounded-full"
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(15,118,110,0.1)",
                }}
                aria-hidden="true"
              >
                <Icon size={26} style={{ color: "#0F766E" }} />
              </div>

              {/* Text */}
              <h3
                className="mb-3 text-lg font-semibold"
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  color: "#134E4A",
                }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  fontWeight: 300,
                  color: "#134E4A",
                  opacity: 0.8,
                  lineHeight: 1.7,
                }}
              >
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
