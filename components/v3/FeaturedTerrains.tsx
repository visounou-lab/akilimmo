"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Maximize, ShieldCheck, Plug, ArrowRight } from "lucide-react";
import type { TerrainCard } from "./terrains/TerrainsListClient";

const COUNTRY_FILTERS = [
  { value: "TOUS",          label: "Tous" },
  { value: "BENIN",         label: "Bénin" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire" },
];

const TITLE_LABEL: Record<string, string> = {
  TITRE_FONCIER: "Titre foncier",
  ACD: "ACD",
  LETTRE_ATTRIBUTION: "Lettre d'attribution",
  CONVENTION_VENTE: "Convention de vente",
  AUTRE: "Autre",
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export default function FeaturedTerrains({ terrains }: { terrains: TerrainCard[] }) {
  const [country, setCountry] = useState("TOUS");

  const filtered = terrains.filter((t) => country === "TOUS" || t.country === country);

  return (
    <section
      id="terrains"
      aria-labelledby="terrains-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <p
              className="mb-2 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A", letterSpacing: "0.14em" }}
            >
              À vendre
            </p>
            <h2
              id="terrains-heading"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "#1C1917",
                letterSpacing: "-0.01em",
              }}
            >
              Nos terrains à vendre
            </h2>
          </div>
          <a
            href="/terrains"
            className="flex items-center gap-1.5 text-sm cursor-pointer transition-colors duration-200 self-start sm:self-auto"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, color: "#1B4D3E" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E07B39")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1B4D3E")}
          >
            Voir tous les terrains
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>

        {/* Filtre pays */}
        <div className="mb-10 flex items-center gap-2" role="group" aria-label="Filtrer par pays">
          {COUNTRY_FILTERS.map((c) => {
            const active = country === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCountry(c.value)}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm cursor-pointer transition-all duration-200"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: active ? 600 : 400,
                  backgroundColor: active ? "#C8922A" : "#FDFCF8",
                  color: active ? "#ffffff" : "#6B5E52",
                  border: `1.5px solid ${active ? "#C8922A" : "#E8DDD0"}`,
                  boxShadow: active ? "0 1px 6px rgba(200,146,42,0.3)" : "none",
                }}
              >
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {filtered.map((t) => {
            const imageSrc = t.images[0] ?? t.imageUrl ?? PLACEHOLDER;
            return (
              <li key={t.id}>
                <article
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                  style={{ backgroundColor: "#FDFCF8", border: "1px solid #E8DDD0", boxShadow: "0 2px 8px rgba(28,25,23,0.05)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 28px rgba(28,25,23,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(28,25,23,0.05)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <a href={`/terrains/${t.slug}`} className="block relative h-52 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={t.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "rgba(28,25,23,0.85)", color: "#FDFCF8", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      <ShieldCheck size={12} aria-hidden="true" style={{ color: "#C8922A" }} />
                      {TITLE_LABEL[t.titleType] ?? t.titleType}
                    </div>
                    {t.serviced && (
                      <div
                        className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: "rgba(27,77,62,0.88)", color: "#FDFCF8", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        <Plug size={12} aria-hidden="true" />
                        Viabilisé
                      </div>
                    )}
                  </a>

                  <a href={`/terrains/${t.slug}`} className="block p-5">
                    {/* Location */}
                    <div
                      className="flex items-center gap-1.5 mb-2"
                      style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", fontWeight: 400, color: "#6B5E52" }}
                    >
                      <MapPin size={12} aria-hidden="true" style={{ color: "#C8922A" }} />
                      <span>{t.city}</span>
                    </div>

                    {/* Title */}
                    <p
                      className="mb-3 line-clamp-2 text-sm font-medium"
                      style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1C1917", lineHeight: 1.45 }}
                    >
                      {t.title}
                    </p>

                    {/* Price */}
                    <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.15rem", color: "#1C1917", marginBottom: "1rem" }}>
                      {fmt(t.price)} <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "#6B5E52" }}>XOF</span>
                    </p>

                    {/* Surface */}
                    <div className="flex items-center gap-4 pt-4" style={{ borderTop: "1px solid #E8DDD0" }}>
                      <span
                        className="flex items-center gap-1.5 text-sm"
                        style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}
                      >
                        <Maximize size={14} aria-hidden="true" />{fmt(t.surface)} m²
                      </span>
                    </div>
                  </a>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
