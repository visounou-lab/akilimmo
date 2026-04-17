"use client";

import { useMemo, useState } from "react";
import BienCard from "../../components/BienCard";

const COUNTRY_OPTIONS = [
  { value: "TOUS",          label: "Tous les pays" },
  { value: "BENIN",         label: "Bénin" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire" },
];

interface Bien {
  id: string;
  title: string;
  city: string;
  country: string;
  price: unknown;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  videoUrl: string | null;
}

export default function FiltresBiens({ biens }: { biens: Bien[] }) {
  const [country, setCountry] = useState("TOUS");
  const [city, setCity]       = useState("TOUTES");

  const cities = useMemo(() => {
    const filtered = country === "TOUS" ? biens : biens.filter((b) => b.country === country);
    return ["TOUTES", ...Array.from(new Set(filtered.map((b) => b.city))).sort()];
  }, [biens, country]);

  const filtered = useMemo(() => {
    return biens.filter((b) => {
      if (country !== "TOUS" && b.country !== country) return false;
      if (city !== "TOUTES" && b.city !== city) return false;
      return true;
    });
  }, [biens, country, city]);

  function handleCountryChange(val: string) {
    setCountry(val);
    setCity("TOUTES");
  }

  return (
    <div className="space-y-8">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 px-6 sm:px-0">
        <div className="flex flex-wrap gap-2">
          {COUNTRY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCountryChange(opt.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                country === opt.value
                  ? "bg-[#0066CC] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {cities.length > 2 && (
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#0066CC] transition"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "TOUTES" ? "Toutes les villes" : c}
              </option>
            ))}
          </select>
        )}

        <span className="ml-auto text-sm text-slate-400">
          {filtered.length} bien{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center">
          <p className="text-slate-500 font-medium">Aucun bien pour ces critères.</p>
          <button
            onClick={() => { setCountry("TOUS"); setCity("TOUTES"); }}
            className="mt-4 text-sm text-[#0066CC] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-0 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((bien) => (
            <BienCard key={bien.id} bien={bien} />
          ))}
        </div>
      )}
    </div>
  );
}
