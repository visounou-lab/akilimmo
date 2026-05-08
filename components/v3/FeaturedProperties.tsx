"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, ArrowRight } from "lucide-react";

const PROPERTIES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=75",
    alt: "Villa moderne avec piscine à Cocody, Abidjan",
    badge: "Disponible",
    type: "Villa",
    city: "Cocody, Abidjan",
    price: "850 000 FCFA / mois",
    beds: 4,
    baths: 3,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=75",
    alt: "Appartement lumineux à Cotonou, Bénin",
    badge: "Disponible",
    type: "Appartement",
    city: "Cotonou, Bénin",
    price: "350 000 FCFA / mois",
    beds: 2,
    baths: 1,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=75",
    alt: "Maison contemporaine à Abomey-Calavi, Bénin",
    badge: "Disponible",
    type: "Maison",
    city: "Abomey-Calavi, Bénin",
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
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
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
              Biens en vedette
            </h2>
          </div>
          <a
            href="#"
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

        {/* Cards */}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PROPERTIES.map((prop) => (
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
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={prop.image}
                    alt={prop.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Available badge */}
                  <div
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "#16A34A",
                      color: "#ffffff",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {prop.badge}
                  </div>
                  {/* Type badge */}
                  <div
                    className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(27,77,62,0.88)",
                      color: "#FDFCF8",
                      fontFamily: "var(--font-inter), sans-serif",
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
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 400,
                      color: "#6B5E52",
                    }}
                  >
                    <MapPin size={12} aria-hidden="true" style={{ color: "#C8922A" }} />
                    <span>{prop.city}</span>
                  </div>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "#1C1917",
                      marginBottom: "1rem",
                    }}
                  >
                    {prop.price}
                  </p>

                  {/* Amenities */}
                  <div
                    className="flex items-center gap-4 pt-4"
                    style={{ borderTop: "1px solid #E8DDD0" }}
                  >
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 300,
                        color: "#6B5E52",
                      }}
                    >
                      <BedDouble size={14} aria-hidden="true" />
                      {prop.beds} ch.
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 300,
                        color: "#6B5E52",
                      }}
                    >
                      <Bath size={14} aria-hidden="true" />
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
