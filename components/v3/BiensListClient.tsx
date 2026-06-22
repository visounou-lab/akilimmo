"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MapPin, BedDouble, Bath, MessageCircle, SearchX, Heart, Eye } from "lucide-react";
import { getPropertyMainImage } from "@/lib/youtube";

function useFavorites(properties: PropertyCardFull[]) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialise les counts depuis les données DB
    const counts: Record<string, number> = {};
    properties.forEach((p) => { counts[p.id] = p.likesCount ?? 0; });
    setLikeCounts(counts);
    // Charge les favoris locaux
    try {
      const raw = localStorage.getItem("akil_favorites_web");
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch {}
  }, [properties]);

  const toggle = useCallback(async (id: string, slug: string) => {
    const wasLiked = favorites.has(id);

    // Mise à jour optimiste locale
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

    // Appel API pour sauvegarder en DB
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
    isFavorite: (id: string) => favorites.has(id),
    getLikeCount: (id: string) => likeCounts[id] ?? 0,
  };
}

export type PropertyCardFull = {
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
  likesCount: number;
  viewCount: number;
  images: { url: string; status: string; order: number }[];
};

const COUNTRY_OPTIONS = [
  { value: "TOUS",          label: "Tous",          flag: "🌍" },
  { value: "BENIN",         label: "Bénin",         flag: "🇧🇯" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire", flag: "🇨🇮" },
] as const;

const PRICE_BRACKETS = [
  { value: "TOUS",              label: "Tous prix" },
  { value: "0-50000",           label: "< 50 000 XOF" },
  { value: "50000-150000",      label: "50k – 150k" },
  { value: "150000-999999999",  label: "> 150 000 XOF" },
] as const;

const WA_NUMBERS: Record<string, string> = {
  BENIN: "2290197598682",
  COTE_D_IVOIRE: "2250710259146",
};

function waHref(property: PropertyCardFull): string {
  const number = WA_NUMBERS[property.country] ?? WA_NUMBERS.BENIN;
  const text = encodeURIComponent(`Bonjour, je suis intéressé par le bien ${property.title}`);
  return `https://wa.me/${number}?text=${text}`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " XOF / nuit";
}

export default function BiensListClient({
  properties,
  initialSearch = "",
}: {
  properties: PropertyCardFull[];
  initialSearch?: string;
}) {
  const [country,    setCountry]    = useState("TOUS");
  const [city,       setCity]       = useState("TOUTES");
  const [priceRange, setPriceRange] = useState("TOUS");
  const [type,       setType]       = useState("TOUS");
  const [search,     setSearch]     = useState(initialSearch);

  const { toggle, isFavorite, getLikeCount } = useFavorites(properties);

  const cities = useMemo(() => {
    const subset = country === "TOUS" ? properties : properties.filter((p) => p.country === country);
    return ["TOUTES", ...Array.from(new Set(subset.map((p) => p.city))).sort()];
  }, [properties, country]);

  const types = useMemo(() => {
    const all = properties.map((p) => p.propertyType).filter(Boolean) as string[];
    return ["TOUS", ...Array.from(new Set(all)).sort()];
  }, [properties]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return properties.filter((p) => {
      if (country !== "TOUS" && p.country !== country) return false;
      if (city !== "TOUTES" && p.city !== city) return false;
      if (type !== "TOUS" && p.propertyType !== type) return false;
      if (priceRange !== "TOUS") {
        const [minStr, maxStr] = priceRange.split("-");
        if (p.price < Number(minStr) || p.price > Number(maxStr)) return false;
      }
      // Recherche texte libre : ville, titre, type
      if (q) {
        const haystack = `${p.city} ${p.title} ${p.propertyType ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [properties, country, city, type, priceRange, search]);

  function handleCountryChange(val: string) {
    setCountry(val);
    setCity("TOUTES");
  }

  function resetFilters() {
    setCountry("TOUS");
    setCity("TOUTES");
    setPriceRange("TOUS");
    setType("TOUS");
    setSearch("");
  }

  return (
    <>
      {/* ── Hero éditorial ── */}
      <section
        aria-label="En-tête de la liste des biens"
        className="py-20 lg:py-28 text-center"
        style={{ backgroundColor: "#FDFCF8" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            className="mb-4 text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A", letterSpacing: "0.16em" }}
          >
            Disponibles maintenant
          </p>
          <h1
            className="mb-5 mx-auto"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#1C1917",
              letterSpacing: "-0.015em",
              lineHeight: 1.15,
              maxWidth: "820px",
            }}
          >
            {search
              ? <>Résultats pour <em style={{ fontStyle: "italic", color: "#C8922A" }}>&ldquo;{search}&rdquo;</em></>
              : <>Tous nos <em style={{ fontStyle: "italic", color: "#C8922A" }}>biens disponibles.</em></>
            }
          </h1>
          <p
            className="mx-auto text-base lg:text-lg"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52", lineHeight: 1.75, maxWidth: "700px" }}
          >
            Villas et appartements meublés vérifiés à la location au Bénin et en
            Côte d&apos;Ivoire. Filtrez par pays et par ville.
          </p>
        </div>
      </section>

      {/* ── Barre de filtres sticky ── */}
      <div
        className="sticky z-40"
        style={{ top: 64, backgroundColor: "#FDFCF8", borderBottom: "1px solid rgba(200,146,42,0.25)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">

            {/* Pills pays */}
            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filtrer par pays">
              {COUNTRY_OPTIONS.map((opt) => {
                const active = country === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleCountryChange(opt.value)}
                    aria-pressed={active}
                    className="cursor-pointer rounded-full px-4 py-2 text-sm transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: active ? 500 : 400,
                      backgroundColor: active ? "#1B4D3E" : "#FDFCF8",
                      color: active ? "#FDFCF8" : "#1B4D3E",
                      border: "1.5px solid #1B4D3E",
                      boxShadow: active ? "0 1px 4px rgba(27,77,62,0.25)" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Select ville */}
            <div className="relative">
              <label htmlFor="filter-ville" className="sr-only">Filtrer par ville</label>
              <select
                id="filter-ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="cursor-pointer appearance-none rounded-full py-2 pl-4 pr-8 text-sm"
                style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#FDFCF8", color: "#1B4D3E", border: "1.5px solid #1B4D3E" }}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === "TOUTES" ? "Toutes les villes" : c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" style={{ color: "#1B4D3E" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>

            {/* Select type */}
            {types.length > 2 && (
              <div className="relative">
                <label htmlFor="filter-type" className="sr-only">Filtrer par type</label>
                <select
                  id="filter-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="cursor-pointer appearance-none rounded-full py-2 pl-4 pr-8 text-sm"
                  style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#FDFCF8", color: "#1B4D3E", border: "1.5px solid #1B4D3E" }}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t === "TOUS" ? "Tous les types" : t}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" style={{ color: "#1B4D3E" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
            )}

            {/* Select prix */}
            <div className="relative">
              <label htmlFor="filter-prix" className="sr-only">Filtrer par prix</label>
              <select
                id="filter-prix"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="cursor-pointer appearance-none rounded-full py-2 pl-4 pr-8 text-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  backgroundColor: priceRange !== "TOUS" ? "#1B4D3E" : "#FDFCF8",
                  color: priceRange !== "TOUS" ? "#FDFCF8" : "#1B4D3E",
                  border: "1.5px solid #1B4D3E",
                }}
              >
                {PRICE_BRACKETS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" style={{ color: priceRange !== "TOUS" ? "#FDFCF8" : "#1B4D3E" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>

            {/* Compteur */}
            <p
              className="sm:ml-auto text-sm"
              aria-live="polite"
              aria-atomic="true"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}
            >
              <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.2rem", color: "#C8922A" }}>
                {filtered.length}
              </span>{" "}
              bien{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Grille de biens ── */}
      <section
        aria-label="Liste des biens disponibles"
        className="py-14 lg:py-20"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="mb-6 flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, backgroundColor: "rgba(200,146,42,0.1)" }}
                aria-hidden="true"
              >
                <SearchX size={32} style={{ color: "#C8922A" }} />
              </div>
              <p className="mb-6 text-center text-lg" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1C1917" }}>
                Aucun bien ne correspond à vos critères.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer rounded-lg px-6 py-2.5 text-sm transition-all duration-200"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, color: "#1B4D3E", border: "1.5px solid #1B4D3E", backgroundColor: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1B4D3E"; e.currentTarget.style.color = "#FDFCF8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1B4D3E"; }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {filtered.map((prop) => {
                const imageSrc  = getPropertyMainImage(prop);
                const liked     = isFavorite(prop.id);
                const likeCount = getLikeCount(prop.id);
                const views     = prop.viewCount;

                return (
                  <li key={prop.id}>
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
                      {/* Image */}
                      <a
                        href={`/biens/${prop.slug}`}
                        className="block relative overflow-hidden"
                        style={{ aspectRatio: "16/10" }}
                        aria-label={`Voir le détail : ${prop.title}`}
                      >
                        <Image
                          src={imageSrc}
                          alt={prop.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div
                          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: "#16A34A", color: "#ffffff", fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          Disponible
                        </div>
                        {prop.propertyType && (
                          <div
                            className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: "rgba(200,146,42,0.9)", color: "#ffffff", fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {prop.propertyType}
                          </div>
                        )}

                        {/* Bouton ❤️ avec compteur */}
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(prop.id, prop.slug); }}
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-all duration-150 hover:scale-105"
                          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
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
                        <div
                          className="flex items-center gap-1.5 mb-2"
                          style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#6B5E52" }}
                        >
                          <MapPin size={12} aria-hidden="true" style={{ color: "#C8922A", flexShrink: 0 }} />
                          <span>{prop.city}</span>
                        </div>

                        <p
                          className="mb-3 line-clamp-2 text-sm font-medium"
                          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1C1917", lineHeight: 1.45 }}
                        >
                          {prop.title}
                        </p>

                        <p
                          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.15rem", color: "#1C1917", marginBottom: "1rem" }}
                        >
                          {formatPrice(prop.price)}
                        </p>

                        <div className="flex items-center gap-4 pt-4" style={{ borderTop: "1px solid #E8DDD0" }}>
                          <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}>
                            <BedDouble size={14} aria-hidden="true" />
                            {prop.bedrooms} ch.
                          </span>
                          <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "#6B5E52" }}>
                            <Bath size={14} aria-hidden="true" />
                            {prop.bathrooms} sdb.
                          </span>
                          {/* Vues réelles */}
                          <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "#94A3B8", fontFamily: "var(--font-inter), sans-serif" }}>
                            <Eye size={12} aria-hidden="true" />
                            {views}
                          </span>
                          {/* Likes */}
                          {likeCount > 0 && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: "#EF4444", fontFamily: "var(--font-inter), sans-serif" }}>
                              <Heart size={12} fill="#EF4444" color="#EF4444" />
                              {likeCount}
                            </span>
                          )}
                        </div>

                        <a
                          href={waHref(prop)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg px-4 py-3 text-sm transition-all duration-200"
                          style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, color: "#E07B39", border: "1.5px solid #E07B39", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E07B39"; e.currentTarget.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#E07B39"; }}
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
          )}
        </div>
      </section>
    </>
  );
}
