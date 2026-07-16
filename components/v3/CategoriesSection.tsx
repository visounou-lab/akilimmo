"use client";

import { ArrowRight, BedDouble, CarFront, House, Map } from "lucide-react";

const CATEGORIES = [
  {
    icon: House,
    title: "Location meublée",
    desc: "Appartements et villas entièrement meublés pour long séjour ou court séjour. Tout inclus — eau, électricité, Wi-Fi.",
    href: "#biens",
    badge: null,
    accent: "#1B4D3E",
  },
  {
    icon: Map,
    title: "Vente de terrains",
    desc: "Parcelles à vendre au Bénin et en Côte d'Ivoire, avec statut juridique vérifié (titre foncier, ACD). Terrains viabilisés ou nus.",
    href: "/terrains",
    badge: null,
    accent: "#1B4D3E",
  },
  {
    icon: CarFront,
    title: "Location de voitures",
    desc: "SUV récents et bien entretenus disponibles à Abidjan — KIA Sportage, Hyundai Tucson, KIA Seltos. Réservation rapide sur WhatsApp.",
    href: "/voitures",
    badge: null,
    accent: "#1B4D3E",
  },
  {
    icon: BedDouble,
    title: "Séjours clé en main",
    desc: "Logements confortables pour les vacances en famille, les voyages d'affaires ou les courts séjours entre le Bénin et la Côte d'Ivoire.",
    href: "/sejours",
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
            <a
              key={cat.title}
              href={cat.href}
              className="group relative flex flex-col rounded-2xl p-6 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2"
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

              {/* Icône */}
              <div
                className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl"
                style={{
                  backgroundColor: cat.badge
                    ? "rgba(200,146,42,0.08)"
                    : "rgba(27,77,62,0.08)",
                }}
              >
                <Icon size={23} color={cat.accent} strokeWidth={1.7} aria-hidden="true" />
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
                {cat.badge
                  ? cat.href === "/sejours" ? "Découvrir le lancement" : "Être notifié"
                  : cat.href === "/voitures" ? "Voir les voitures" : "Voir les biens"}
                <ArrowRight size={13} aria-hidden="true" />
              </div>
            </a>
          )})}
        </div>
      </div>
    </section>
  );
}
