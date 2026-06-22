"use client";

import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const CITIES = [
  "Abidjan", "Cotonou", "Cocody", "Angré", "Zone 4",
  "Abomey-Calavi", "Tokan", "Calavi", "Plateau", "Marcory",
];

export default function HeroSection() {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      window.location.href = `/biens?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = "#categories";
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
          alt="Belle villa dans un quartier résidentiel en Afrique de l'Ouest"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Charcoal overlay — Option C */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(28,25,23,0.96) 0%, rgba(28,25,23,0.88) 55%, rgba(28,25,23,0.72) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Badge pays */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-medium tracking-widest uppercase"
          style={{
            backgroundColor: "rgba(200,146,42,0.18)",
            border: "1px solid rgba(200,146,42,0.55)",
            color: "#C8922A",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          Bénin · Côte d&apos;Ivoire
        </div>

        {/* Headline */}
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5.5vw, 4rem)",
            lineHeight: 1.15,
            color: "#FDFCF8",
            letterSpacing: "-0.01em",
          }}
        >
          Location, vente, voitures &amp; séjours
          <br />
          <em style={{ fontStyle: "italic", color: "#C8922A" }}>
            à portée de main en Afrique de l&apos;Ouest.
          </em>
        </h1>

        {/* Sous-titre */}
        <p
          className="mx-auto mb-10 max-w-2xl text-base sm:text-lg"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            color: "rgba(253,252,248,0.65)",
            lineHeight: 1.8,
          }}
        >
          Appartements meublés vérifiés, villas à vendre, voitures de qualité et séjours
          clé en main à Abidjan, Cotonou, Angré et Abomey-Calavi.
          Depuis la diaspora ou sur place — on s&apos;occupe de tout.
        </p>

        {/* Barre de recherche — toujours en ligne pour éviter le problème de clavier mobile */}
        <form
          onSubmit={handleSearch}
          className="mx-auto flex flex-row max-w-2xl gap-2"
          role="search"
          aria-label="Rechercher un bien"
        >
          <div
            className="relative flex-1 min-w-0"
            style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12 }}
          >
            <Search
              size={15}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(253,252,248,0.45)" }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ville ou quartier…"
              list="city-suggestions"
              className="w-full bg-transparent pl-9 pr-3 py-3.5 text-sm outline-none"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#FDFCF8",
                border: "1.5px solid rgba(253,252,248,0.2)",
                borderRadius: 12,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(200,146,42,0.6)")}
              onBlur={(e) =>  (e.currentTarget.style.borderColor = "rgba(253,252,248,0.2)")}
            />
            <datalist id="city-suggestions">
              {CITIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Desktop : texte + icône — Mobile : icône seule */}
          <button
            type="submit"
            aria-label="Rechercher"
            className="flex items-center justify-center gap-2 cursor-pointer rounded-xl px-4 sm:px-6 py-3.5 text-sm font-medium transition-all duration-200 shrink-0"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              backgroundColor: "#C8922A",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(200,146,42,0.45)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A97620";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#C8922A";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="hidden sm:inline">Rechercher</span>
            <Search size={16} aria-hidden="true" className="sm:hidden" />
            <ArrowRight size={15} aria-hidden="true" className="hidden sm:inline" />
          </button>
        </form>

        {/* Quick links */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {[
            { label: "Long séjour",   href: "#biens" },
            { label: "Court séjour",  href: "#biens" },
            { label: "Cocody",        href: "/biens?q=Cocody" },
            { label: "Zone 4",        href: "/biens?q=Zone+4" },
            { label: "Cotonou",       href: "/biens?q=Cotonou" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="rounded-full px-3.5 py-1.5 text-xs cursor-pointer transition-colors duration-150"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(253,252,248,0.55)",
                border: "1px solid rgba(253,252,248,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#C8922A";
                e.currentTarget.style.borderColor = "rgba(200,146,42,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(253,252,248,0.55)";
                e.currentTarget.style.borderColor = "rgba(253,252,248,0.18)";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <span
          style={{ display: "block", width: 28, height: 1, backgroundColor: "#C8922A", opacity: 0.5 }}
          aria-hidden="true"
        />
        <a
          href="#categories"
          className="text-xs tracking-widest uppercase cursor-pointer"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "rgba(253,252,248,0.38)",
          }}
        >
          Découvrir
        </a>
        <span
          style={{ display: "block", width: 28, height: 1, backgroundColor: "#C8922A", opacity: 0.5 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
