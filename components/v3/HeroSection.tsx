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

        {/* Barre de recherche unifiée — un seul bloc, bouton intégré à droite */}
        <form
          onSubmit={handleSearch}
          role="search"
          aria-label="Rechercher un bien"
          className="mx-auto max-w-xl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.10)",
            border: "1.5px solid rgba(253,252,248,0.22)",
            borderRadius: 14,
            padding: "5px 5px 5px 14px",
            backdropFilter: "blur(8px)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,146,42,0.6)";
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(253,252,248,0.22)";
            }
          }}
        >
          <Search
            size={15}
            aria-hidden="true"
            style={{ color: "rgba(253,252,248,0.4)", flexShrink: 0 }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville ou quartier… ex: Cocody, Zone 4"
            list="city-suggestions"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#FDFCF8",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          />
          <datalist id="city-suggestions">
            {CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>

          <button
            type="submit"
            aria-label="Rechercher"
            className="flex items-center justify-center gap-1.5 cursor-pointer rounded-[10px] text-sm font-semibold shrink-0 transition-all duration-150"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              backgroundColor: "#C8922A",
              color: "#ffffff",
              padding: "10px 18px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A97620")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8922A")}
          >
            <span className="hidden xs:inline sm:inline">Rechercher</span>
            <ArrowRight size={14} aria-hidden="true" />
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
