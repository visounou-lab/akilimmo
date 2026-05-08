"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Aminata K.",
    location: "Paris, France",
    initials: "AK",
    quote:
      "Je cherchais un appartement à Cotonou depuis la France sans savoir à qui faire confiance. AKIL IMMO m'a organisé une visite vidéo en direct, répondu à toutes mes questions et m'a aidée à signer à distance en moins de deux semaines. Aujourd'hui, ma famille vit dans cet appartement. Je recommande sans hésiter.",
    property: "Appartement · Cotonou",
  },
  {
    id: 2,
    name: "Jean-Luc M.",
    location: "Montréal, Canada",
    initials: "JM",
    quote:
      "Investir au pays depuis l'étranger, c'était mon grand projet depuis des années. AKIL IMMO a rendu ça possible. Suivi mensuel, loyers versés sans retard, interlocuteur toujours disponible sur WhatsApp. C'est exactement le sérieux qu'on attend quand on confie son investissement à distance.",
    property: "Villa · Cocody, Abidjan",
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
