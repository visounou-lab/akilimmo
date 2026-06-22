"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, BedDouble, Bath, ArrowRight, MessageCircle, Heart } from "lucide-react";
import { getPropertyMainImage } from "@/lib/youtube";

function useFavorites(properties: PropertyCard[]) {
  const [favorites,  setFavorites]  = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const counts: Record<string, number> = {};
    properties.forEach((p) => { counts[p.id] = p.likesCount ?? 0; });
    setLikeCounts(counts);
    try { const raw = localStorage.getItem("akil_favorites_web"); if (raw) setFavorites(new Set(JSON.parse(raw))); } catch {}
  }, [properties]);

  const toggle = useCallback(async (id: string, slug: string) => {
    const wasLiked = favorites.has(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(id) : next.add(id);
      try { localStorage.setItem("akil_favorites_web", JSON.stringify([...next])); } catch {}
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + (wasLiked ? -1 : 1)),
    }));
    try {
      await fetch(`/api/property/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: wasLiked ? "unlike" : "like" }),
      });
    } catch {}
  }, [favorites]);

  return {
    toggle,
    isFavorite:   (id: string) => favorites.has(id),
    getLikeCount: (id: string) => likeCounts[id] ?? 0,
  };
}

const COUNTRY_FILTERS = [
  { value: "TOUS",          label: "Tous",          flag: "🌍" },
  { value: "BENIN",         label: "Bénin",         flag: "🇧🇯" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire", flag: "🇨🇮" },
];

const TABS = ["Long séjour", "Court séjour"] as const;
type Tab = (typeof TABS)[number];

export type PropertyCard = {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: "BENIN" | "COTE_D_IVOIRE";
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  videoUrl: string | null;
  propertyType: string | null;
  stayType: string;
  likesCount: number;
  images: { url: string; status: string; order: number }[];
};


const WA_NUMBERS: Record<string, string> = {
  BENIN: "2290197598682",
  COTE_D_IVOIRE: "2250710259146",
};

function waHref(property: PropertyCard): string {
  const number = WA_NUMBERS[property.country] ?? WA_NUMBERS.BENIN;
  const text = encodeURIComponent(
    `Bonjour, je suis intéressé par le bien ${property.title}`
  );
  return `https://wa.me/${number}?text=${text}`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " XOF / nuit";
}

export default function FeaturedProperties({
  properties,
}: {
  properties: PropertyCard[];
}) {
  const [activeTab,  setActiveTab]  = useState<Tab>("Long séjour");
  const [country,    setCountry]    = useState("TOUS");
  const { toggle, isFavorite, getLikeCount } = useFavorites(properties);

  const tabKey = activeTab === "Long séjour" ? "long" : "short";
  const filtered = properties.filter((p) => {
    const matchCountry = country === "TOUS" || p.country === country;
    const matchStay    = p.stayType === tabKey || p.stayType === "both";
    return matchCountry && matchStay;
  });

  return (
    <section
      id="biens"
      aria-labelledby="properties-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <p
              className="mb-2 text-xs font-medium tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#C8922A",
                letterSpacing: "0.14em",
              }}
            >
              Sélection du moment
            </p>
            <h2
              id="properties-heading"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "#1C1917",
                letterSpacing: "-0.01em",
              }}
            >
              Nos biens meublés disponibles
            </h2>
          </div>
          <a
            href="/biens"
            className="flex items-center gap-1.5 text-sm cursor-pointer transition-colors duration-200 self-start sm:self-auto"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              color: "#1B4D3E",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E07B39")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1B4D3E")}
          >
            Voir tous les biens
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>

        {/* Toggles + filtre pays */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Long/Court séjour */}
          <div
            className="inline-flex rounded-xl p-1 gap-1"
            style={{ backgroundColor: "#E8DDD0" }}
            role="tablist"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-lg px-5 py-2 text-sm cursor-pointer transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: isActive ? 500 : 400,
                    backgroundColor: isActive ? "#1B4D3E" : "transparent",
                    color: isActive ? "#FDFCF8" : "#6B5E52",
                    boxShadow: isActive ? "0 1px 4px rgba(27,77,62,0.25)" : "none",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Filtre pays */}
          <div className="flex items-center gap-2" role="group" aria-label="Filtrer par pays">
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
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {filtered.map((prop) => {
            const imageSrc  = getPropertyMainImage(prop);
            const liked     = isFavorite(prop.id);
            const likeCount = getLikeCount(prop.id);
            return (
              <li key={prop.id}>
                <article
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "#FDFCF8",
                    border: "1px solid #E8DDD0",
                    boxShadow: "0 2px 8px rgba(28,25,23,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 28px rgba(28,25,23,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 8px rgba(28,25,23,0.05)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Image */}
                  <a href={`/biens/${prop.slug}`} className="block relative h-52 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={prop.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Disponible badge */}
                    <div
                      className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#16A34A",
                        color: "#ffffff",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      Disponible
                    </div>
                    {/* Type badge */}
                    {prop.propertyType && (
                      <div
                        className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "rgba(27,77,62,0.88)",
                          color: "#FDFCF8",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {prop.propertyType}
                      </div>
                    )}

                    {/* Heart button avec compteur */}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(prop.id, prop.slug); }}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-all duration-150 hover:scale-105"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                      aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart size={14} fill={liked ? "#EF4444" : "none"} color={liked ? "#EF4444" : "#ffffff"} />
                      {likeCount > 0 && (
                        <span className="text-xs font-medium" style={{ color: liked ? "#EF4444" : "#ffffff", lineHeight: 1 }}>
                          {likeCount}
                        </span>
                      )}
                    </button>
                  </a>

                  {/* Body */}
                  <div className="p-5">
                    {/* Location */}
                    <div
                      className="flex items-center gap-1.5 mb-2"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        color: "#6B5E52",
                      }}
                    >
                      <MapPin size={12} aria-hidden="true" style={{ color: "#C8922A" }} />
                      <span>{prop.city}</span>
                    </div>

                    {/* Title */}
                    <p
                      className="mb-3 line-clamp-2 text-sm font-medium"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#1C1917",
                        lineHeight: 1.45,
                      }}
                    >
                      {prop.title}
                    </p>

                    {/* Price */}
                    <p
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        color: "#1C1917",
                        marginBottom: "1rem",
                      }}
                    >
                      {formatPrice(prop.price)}
                    </p>

                    {/* Amenities + vues */}
                    <div
                      className="flex items-center gap-4 pt-4"
                      style={{ borderTop: "1px solid #E8DDD0" }}
                    >
                      <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}>
                        <BedDouble size={14} aria-hidden="true" />{prop.bedrooms} ch.
                      </span>
                      <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}>
                        <Bath size={14} aria-hidden="true" />{prop.bathrooms} sdb.
                      </span>
                      {likeCount > 0 && (
                        <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "#EF4444", fontFamily: "var(--font-inter), sans-serif" }}>
                          <Heart size={12} fill="#EF4444" color="#EF4444" />
                          {likeCount}
                        </span>
                      )}
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={waHref(prop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg px-4 py-3 text-sm transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 500,
                        color: "#E07B39",
                        border: "1.5px solid #E07B39",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E07B39";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#E07B39";
                      }}
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      Réserver sur WhatsApp
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
