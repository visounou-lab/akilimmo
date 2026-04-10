"use client";

import { useMemo, useState } from "react";
import PropertyCard from "./property-card";

const properties = [
  {
    id: 1,
    title: "Villa moderne à Abidjan",
    location: "Cocody, Abidjan",
    country: "Côte d'Ivoire",
    price: "2 100 000 XOF",
    status: "Disponible",
    bedrooms: 4,
    bathrooms: 3,
    area: "320 m²",
  },
  {
    id: 2,
    title: "Appartement haut standing",
    location: "Quartier V, Cotonou",
    country: "Bénin",
    price: "930 000 XOF",
    status: "Disponible",
    bedrooms: 3,
    bathrooms: 2,
    area: "170 m²",
  },
  {
    id: 3,
    title: "Maison familiale près de la plage",
    location: "Grand-Bassam",
    country: "Côte d'Ivoire",
    price: "1 450 000 XOF",
    status: "Réservé",
    bedrooms: 5,
    bathrooms: 4,
    area: "420 m²",
  },
  {
    id: 4,
    title: "Duplex premium à Porto-Novo",
    location: "Porto-Novo Centre",
    country: "Bénin",
    price: "880 000 XOF",
    status: "Disponible",
    bedrooms: 3,
    bathrooms: 2,
    area: "190 m²",
  },
];

const countries = ["Tous", "Bénin", "Côte d'Ivoire"] as const;

export default function PropertyList() {
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[number]>("Tous");

  const filteredProperties = useMemo(() => {
    if (selectedCountry === "Tous") {
      return properties;
    }

    return properties.filter((property) => property.country === selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {countries.map((country) => (
          <button
            key={country}
            type="button"
            onClick={() => setSelectedCountry(country)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              selectedCountry === country
                ? "bg-[#0066CC] text-white"
                : "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
