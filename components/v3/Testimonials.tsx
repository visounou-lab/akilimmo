"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Aminata K.",
    location: "Paris, France",
    initials: "AK",
    quote:
      "Je cherchais un appartement à Cotonou depuis la France. Sur AKIL IMMO, j'ai trouvé une annonce avec une vidéo complète du bien et toutes les photos dont j'avais besoin. J'ai contacté le propriétaire sur WhatsApp, posé toutes mes questions, et réservé en quelques jours. À mon arrivée, tout correspondait à l'annonce. Je recommande sans hésiter.",
    property: "Locataire · Cotonou",
  },
  {
    id: 2,
    name: "Sarah B.",
    location: "Expat en mission à Abidjan",
    initials: "SB",
    quote:
      "Je suis arrivée à Abidjan pour une mission de 8 mois. AKIL IMMO m'a permis de comparer plusieurs appartements meublés à Cocody depuis Paris, vidéos et photos à l'appui. Échange WhatsApp clair avec le propriétaire, réservation rapide, clés à l'arrivée. Plateforme sérieuse et efficace.",
    property: "Appartement meublé · Cocody",
  },
  {
    id: 3,
    name: "Jean-Luc M.",
    location: "Montréal, Canada",
    initials: "JM",
    quote:
      "Mon appartement à Cocody dormait depuis deux ans. AKIL IMMO l'a remis en valeur, trouvé un locataire sérieux en trois semaines, et m'envoie chaque mois un reporting WhatsApp. Zéro impayé, zéro souci à 6 000 km.",
    property: "Propriétaire · Cocody, Abidjan",
  },
  {
    id: 4,
    name: "M. Dossou",
    location: "Agence Immobilière Étoile, Cotonou",
    initials: "MD",
    quote:
      "On avait des biens meublés haut de gamme qui peinaient à trouver preneur en local. En s'associant à AKIL IMMO, on touche maintenant la diaspora et les expat's. Trois biens placés en deux mois. Une vraie complémentarité.",
    property: "Partenaire AKIL IMMO · Cotonou",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
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
            Ils nous font confiance
          </p>
          <h2
            id="testimonials-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
            }}
          >
            Ce que disent nos clients
          </h2>
        </div>

        {/* Cards */}
        <ul className="grid gap-8 md:grid-cols-2" role="list">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <figure
                className="h-full rounded-2xl p-8 flex flex-col transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: "#F5F0E8",
                  border: "1px solid #E8DDD0",
                  boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 10px 24px rgba(28,25,23,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#C8922A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 8px rgba(28,25,23,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
                }}
              >
                {/* Gold quote icon */}
                <Quote
                  size={26}
                  aria-hidden="true"
                  style={{ color: "#C8922A", marginBottom: "1.25rem", opacity: 0.75 }}
                />

                {/* Text */}
                <blockquote className="flex-1">
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "#1C1917",
                      lineHeight: 1.8,
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Divider */}
                <div
                  className="my-5"
                  style={{ height: 1, backgroundColor: "#E8DDD0" }}
                  aria-hidden="true"
                />

                {/* Author */}
                <figcaption className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center rounded-full text-sm font-semibold shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "#1B4D3E",
                      color: "#FDFCF8",
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                    }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: "#1C1917",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 400,
                        color: "#6B5E52",
                      }}
                    >
                      {t.location} · {t.property}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
