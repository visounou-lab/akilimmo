"use client";

import { ClipboardCheck, Images, UserCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Le dossier est examiné",
    description:
      "Notre équipe relit les informations transmises : description, localisation, prix, capacité et équipements annoncés.",
    ariaLabel: "Étape 1 : examen des informations du bien",
  },
  {
    icon: Images,
    step: "02",
    title: "Les médias sont contrôlés",
    description:
      "Les photos et vidéos sont vérifiées avant leur affichage. Les contenus insuffisants ou incohérents peuvent être refusés.",
    ariaLabel: "Étape 2 : contrôle des photos et vidéos",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Un humain décide",
    description:
      "Un administrateur publie, demande une correction ou refuse l'annonce. Aucun bien soumis par un partenaire n'est publié automatiquement.",
    ariaLabel: "Étape 3 : décision de publication par un administrateur",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="hiw-heading"
      className="py-16 lg:py-20"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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
            Notre méthode de contrôle
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
            Avant publication, chaque annonce est relue.
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
            Nous contrôlons la qualité et la cohérence des informations reçues
            avant de présenter un bien sur AKIL IMMO.
          </p>
        </div>

        {/* Steps */}
        <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ icon: Icon, step, title, description, ariaLabel }) => (
            <li
              key={step}
              aria-label={ariaLabel}
              className="relative flex flex-col items-center text-center rounded-2xl p-6 lg:p-8 transition-all duration-200 cursor-default"
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

        <p
          className="mx-auto mt-8 max-w-3xl text-center text-sm"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "#6B5E52",
            lineHeight: 1.7,
          }}
        >
          Cette revue améliore la fiabilité de l&apos;annonce, sans remplacer une
          expertise technique ou juridique. Pour tout point décisif, notre équipe
          vous aide à obtenir une confirmation avant réservation.
        </p>
      </div>
    </section>
  );
}
