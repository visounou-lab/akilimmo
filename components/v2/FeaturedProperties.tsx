"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, ArrowRight } from "lucide-react";

const PROPERTIES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=75",
    alt: "Villa moderne avec piscine à Cocody, Abidjan",
    badge: "Disponible",
    type: "Villa",
    city: "Cocody, Abidjan",
    country: "Côte d'Ivoire",
    price: "850 000 FCFA / mois",
    beds: 4,
    baths: 3,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=75",
    alt: "Appartement lumineux à Cotonou, Bénin",
    badge: "Disponible",
    type: "Appartement",
    city: "Cotonou, Bénin",
    country: "Bénin",
    price: "350 000 FCFA / mois",
    beds: 2,
    baths: 1,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=75",
    alt: "Maison contemporaine à Abomey-Calavi, Bénin",
    badge: "Disponible",
    type: "Maison",
    city: "Abomey-Calavi, Bénin",
    country: "Bénin",
    price: "280 000 FCFA / mois",
    beds: 3,
    baths: 2,
  },
];

export default function FeaturedProperties() {
  return (
    <section
      id="biens"
      aria-labelledby="properties-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p
              className="mb-3 text-xs font-semibold tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-josefin), sans-serif",
                color: "#14B8A6",
              }}
            >
              Sélection du moment
            </p>
            <h2
              id="properties-heading"
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontWeight: 700,
                color: "#134E4A",
                letterSpacing: "-0.02em",
              }}
            >
              Biens en vedette
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-colors duration-200 self-start sm:self-auto"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              color: "#0369A1",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0F766E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#0369A1")}
          >
            Voir tous les biens
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>

        {/* Cards grid */}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PROPERTIES.map((prop) => (
            <li key={prop.id}>
              <article
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "#F0FDFA",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.12)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 6px rgba(0,0,0,0.07)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={prop.image}
                    alt={prop.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: "#16A34A",
                      color: "#ffffff",
                      fontFamily: "var(--font-josefin), sans-serif",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {prop.badge}
                  </div>
                  {/* Type badge */}
                  <div
                    className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: "rgba(15,118,110,0.85)",
                      color: "#F0FDFA",
                      fontFamily: "var(--font-josefin), sans-serif",
                    }}
                  >
                    {prop.type}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Location */}
                  <div
                    className="flex items-center gap-1.5 mb-3"
                    style={{
                      fontFamily: "var(--font-josefin), sans-serif",
                      fontSize: "0.8rem",
                      color: "#0F766E",
                    }}
                  >
                    <MapPin size={13} aria-hidden="true" />
                    <span>{prop.city}</span>
                  </div>

                  {/* Price */}
                  <p
                    className="text-xl font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: "#134E4A",
                    }}
                  >
                    {prop.price}
                  </p>

                  {/* Amenities */}
                  <div
                    className="flex items-center gap-4 pt-4"
                    style={{
                      borderTop: "1px solid rgba(20,184,166,0.25)",
                    }}
                  >
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={{
                        fontFamily: "var(--font-josefin), sans-serif",
                        color: "#134E4A",
                        opacity: 0.75,
                      }}
                    >
                      <BedDouble size={15} aria-hidden="true" />
                      {prop.beds} ch.
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={{
                        fontFamily: "var(--font-josefin), sans-serif",
                        color: "#134E4A",
                        opacity: 0.75,
                      }}
                    >
                      <Bath size={15} aria-hidden="true" />
                      {prop.baths} sdb.
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
