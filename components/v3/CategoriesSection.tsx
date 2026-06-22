"use client";

import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    emoji: "🏠",
    title: "Location meublée",
    desc: "Appartements et villas entièrement meublés pour long séjour ou court séjour. Tout inclus — eau, électricité, Wi-Fi.",
    href: "#biens",
    badge: null,
    accent: "#1B4D3E",
  },
  {
    emoji: "🏡",
    title: "Vente immobilière",
    desc: "Maisons, villas et terrains à vendre à Abidjan, Angré, Cotonou et Abomey-Calavi. Investissez en toute confiance.",
    href: "#contact",
    badge: "Bientôt",
    accent: "#C8922A",
  },
  {
    emoji: "🚗",
    title: "Location de voitures",
    desc: "Véhicules récents, bien entretenus, disponibles à l'aéroport ou en ville. Avec ou sans chauffeur.",
    href: "#contact",
    badge: "Bientôt",
    accent: "#C8922A",
  },
  {
    emoji: "🛏️",
    title: "Séjours clé en main",
    desc: "Logements thématiques pour les fêtes du Vodoun, les vacances en famille ou les voyages d'affaires entre Bénin et CI.",
    href: "#contact",
    badge: "Bientôt",
    accent: "#C8922A",
  },
];

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="py-16 lg:py-24"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="mb-2 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.14em",
            }}
          >
            Nos services
          </p>
          <h2
            id="categories-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
            }}
          >
            Tout ce dont vous avez besoin,
            <span style={{ color: "#C8922A" }}> en un seul endroit</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="group relative flex flex-col rounded-2xl p-6 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "#FDFCF8",
                border: "1.5px solid #E8DDD0",
                boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(28,25,23,0.10)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.borderColor = "#C8922A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(28,25,23,0.04)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
              }}
            >
              {/* Badge Bientôt */}
              {cat.badge && (
                <span
                  className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    backgroundColor: "rgba(200,146,42,0.12)",
                    color: "#C8922A",
                    border: "1px solid rgba(200,146,42,0.3)",
                  }}
                >
                  {cat.badge}
                </span>
              )}

              {/* Emoji icon */}
              <div
                className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
                style={{
                  backgroundColor: cat.badge
                    ? "rgba(200,146,42,0.08)"
                    : "rgba(27,77,62,0.08)",
                }}
              >
                {cat.emoji}
              </div>

              {/* Title */}
              <h3
                className="mb-2 text-base font-semibold"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#1C1917",
                }}
              >
                {cat.title}
              </h3>

              {/* Desc */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 400,
                  color: "#6B5E52",
                  lineHeight: 1.65,
                }}
              >
                {cat.desc}
              </p>

              {/* Arrow */}
              <div
                className="mt-5 flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
                style={{ color: cat.badge ? "#C8922A" : "#1B4D3E" }}
              >
                {cat.badge ? "Être notifié" : "Voir les biens"}
                <ArrowRight size={13} aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
