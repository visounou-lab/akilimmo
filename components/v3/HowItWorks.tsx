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
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Gold ornament */}
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
            className="mb-3 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.14em",
            }}
          >
            Simple · Transparent · Sécurisé
          </p>
          <h2
            id="hiw-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Comment ça marche ?
          </h2>
          <p
            className="mt-4 mx-auto max-w-xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "#6B5E52",
              lineHeight: 1.75,
            }}
          >
            Trois étapes claires pour investir au pays sans jamais quitter votre
            ville de résidence.
          </p>
        </div>

        {/* Steps */}
        <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ icon: Icon, step, title, description, ariaLabel }) => (
            <li
              key={step}
              aria-label={ariaLabel}
              className="relative flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-200 cursor-default"
              style={{
                backgroundColor: "#F5F0E8",
                border: "1px solid #E8DDD0",
                boxShadow: "0 2px 8px rgba(28,25,23,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 24px rgba(28,25,23,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.borderColor = "#C8922A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 8px rgba(28,25,23,0.05)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
              }}
            >
              {/* Step number */}
              <span
                className="absolute -top-3.5 text-xs font-medium"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#1B4D3E",
                  backgroundColor: "#FDFCF8",
                  padding: "2px 12px",
                  borderRadius: "999px",
                  border: "1px solid #E8DDD0",
                  letterSpacing: "0.08em",
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
                  backgroundColor: "rgba(27,77,62,0.08)",
                  border: "1px solid rgba(200,146,42,0.3)",
                }}
                aria-hidden="true"
              >
                <Icon size={24} style={{ color: "#1B4D3E" }} />
              </div>

              {/* Text */}
              <h3
                className="mb-3 text-lg"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 600,
                  color: "#1C1917",
                }}
              >
                {title}
              </h3>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
