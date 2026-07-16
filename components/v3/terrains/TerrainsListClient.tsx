"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Maximize, ShieldCheck, Plug } from "lucide-react";

export interface TerrainCard {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  price: number;
  surface: number;
  titleType: string;
  serviced: boolean;
  imageUrl: string | null;
  images: string[];
}

interface Props {
  terrains: TerrainCard[];
}

const TITLE_LABEL: Record<string, string> = {
  TITRE_FONCIER: "Titre foncier",
  ACD: "ACD",
  LETTRE_ATTRIBUTION: "Lettre d'attribution",
  CONVENTION_VENTE: "Convention de vente",
  AUTRE: "Autre",
};

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export default function TerrainsListClient({ terrains }: Props) {
  const [search, setSearch]   = useState("");
  const [country, setCountry] = useState<"ALL" | "BENIN" | "COTE_D_IVOIRE">("ALL");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return terrains.filter((t) => {
      if (country !== "ALL" && t.country !== country) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
      );
    });
  }, [terrains, search, country]);

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 text-center overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(200,146,42,0.5) 40px,rgba(200,146,42,0.5) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(200,146,42,0.5) 40px,rgba(200,146,42,0.5) 41px)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p
            className="mb-3 text-xs font-medium tracking-widest uppercase"
            style={{ color: "#C8922A", letterSpacing: "0.16em", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Vente de terrains
          </p>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              color: "#FDFCF8",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Trouvez votre terrain<span style={{ color: "#C8922A" }}> en toute confiance</span>
          </h1>
          <p
            className="mt-4 mx-auto max-w-2xl text-sm sm:text-base"
            style={{ color: "rgba(253,252,248,0.7)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}
          >
            Parcelles à vendre au Bénin et en Côte d&apos;Ivoire, avec statut juridique vérifié par notre équipe.
          </p>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="py-10 lg:py-14" style={{ backgroundColor: "#FDFCF8" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par ville ou titre…"
              className="flex-1 rounded-xl px-4 py-3 text-sm"
              style={{ border: "1.5px solid #E8DDD0", backgroundColor: "#FFFFFF", color: "#1C1917", fontFamily: "var(--font-inter), sans-serif", outline: "none" }}
            />
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1.5px solid #E8DDD0" }}>
              {(["ALL", "BENIN", "COTE_D_IVOIRE"] as const).map((c, i) => {
                const active = country === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCountry(c)}
                    className="px-4 py-3 text-sm transition-colors whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: active ? 500 : 400,
                      backgroundColor: active ? "#1B4D3E" : "#FFFFFF",
                      color: active ? "#FDFCF8" : "#6B5E52",
                      borderLeft: i > 0 ? "1.5px solid #E8DDD0" : "none",
                    }}
                  >
                    {c === "ALL" ? "Tous" : COUNTRY_LABEL[c]}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.3rem", color: "#1C1917" }}>
                {terrains.length === 0
                  ? "Les premiers terrains arrivent très bientôt."
                  : "Aucun terrain ne correspond à votre recherche."}
              </p>
              <p className="mt-2 text-sm" style={{ color: "#6B5E52", fontFamily: "var(--font-inter), sans-serif" }}>
                {terrains.length === 0
                  ? "Vous vendez un terrain ? Publiez-le gratuitement et touchez des acheteurs vérifiés."
                  : "De nouveaux terrains sont ajoutés régulièrement — revenez bientôt."}
              </p>
              {terrains.length === 0 && (
                <a
                  href="/inscription"
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
                  style={{ backgroundColor: "#C8922A", color: "#ffffff", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Mettre mon terrain en vente
                </a>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => {
                const cover = t.images[0] ?? t.imageUrl;
                return (
                  <Link
                    key={t.id}
                    href={`/terrains/${t.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-200"
                    style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #E8DDD0", boxShadow: "0 2px 8px rgba(28,25,23,0.04)" }}
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={t.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                          <Maximize size={32} aria-hidden="true" />
                        </div>
                      )}
                      <span
                        className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ backgroundColor: "rgba(28,25,23,0.85)", color: "#FDFCF8" }}
                      >
                        <ShieldCheck size={12} aria-hidden="true" style={{ color: "#C8922A" }} />
                        {TITLE_LABEL[t.titleType] ?? t.titleType}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h2
                        className="text-base font-semibold leading-snug line-clamp-2"
                        style={{ fontFamily: "var(--font-playfair), serif", color: "#1C1917" }}
                      >
                        {t.title}
                      </h2>
                      <p
                        className="mt-1 flex items-center gap-1 text-sm"
                        style={{ color: "#6B5E52", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        <MapPin size={13} aria-hidden="true" style={{ color: "#C8922A" }} />
                        {t.city} — {COUNTRY_LABEL[t.country] ?? t.country}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: "#3D3530", fontFamily: "var(--font-inter), sans-serif" }}>
                        <span className="inline-flex items-center gap-1">
                          <Maximize size={13} aria-hidden="true" style={{ color: "#C8922A" }} />
                          {fmt(t.surface)} m²
                        </span>
                        {t.serviced && (
                          <span className="inline-flex items-center gap-1">
                            <Plug size={13} aria-hidden="true" style={{ color: "#1B4D3E" }} />
                            Viabilisé
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-4">
                        <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.35rem", color: "#1C1917" }}>
                          {fmt(t.price)}{" "}
                          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "#6B5E52" }}>
                            XOF
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
