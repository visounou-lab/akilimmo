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
      style={{ backgroundColor: "#F0FDFA" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="mb-3 text-xs font-semibold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              color: "#14B8A6",
            }}
          >
            Ils nous font confiance
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl"
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontWeight: 700,
              color: "#134E4A",
              letterSpacing: "-0.02em",
            }}
          >
            Ce que disent nos clients
          </h2>
        </div>

        {/* Cards */}
        <ul
          className="grid gap-8 md:grid-cols-2"
          role="list"
          aria-label="Témoignages clients"
        >
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <figure
                className="h-full rounded-2xl p-8 flex flex-col transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
                  borderLeft: "4px solid #0F766E",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.09)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 6px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Quote icon */}
                <Quote
                  size={28}
                  aria-hidden="true"
                  style={{ color: "#14B8A6", marginBottom: "1rem", opacity: 0.7 }}
                />

                {/* Text */}
                <blockquote className="flex-1">
                  <p
                    className="text-base leading-relaxed italic"
                    style={{
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontWeight: 300,
                      color: "#134E4A",
                      lineHeight: 1.75,
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <figcaption className="mt-6 flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center rounded-full text-sm font-bold shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "#0F766E",
                      color: "#F0FDFA",
                      fontFamily: "var(--font-cinzel), serif",
                    }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>

                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{
                        fontFamily: "var(--font-josefin), sans-serif",
                        color: "#134E4A",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        fontFamily: "var(--font-josefin), sans-serif",
                        color: "#0F766E",
                        letterSpacing: "0.03em",
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
