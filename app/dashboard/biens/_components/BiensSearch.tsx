"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";

type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  videoUrl: string | null;
  images?: { url: string }[];
  owner: { name: string | null };
};

export default function BiensSearch({ properties }: { properties: Property[] }) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? properties.filter((p) => {
        const s = q.toLowerCase();
        return (
          p.title.toLowerCase().includes(s) ||
          p.city.toLowerCase().includes(s) ||
          (p.owner.name ?? "").toLowerCase().includes(s)
        );
      })
    : properties;

  return (
    <>
      <div className="relative mb-4 w-full sm:w-80">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Titre, ville ou propriétaire…"
          className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-slate-500 font-medium">Aucun résultat pour « {q} »</p>
          <button onClick={() => setQ("")} className="text-sm text-[#0066CC] mt-2 hover:underline">Effacer la recherche</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </>
  );
}
