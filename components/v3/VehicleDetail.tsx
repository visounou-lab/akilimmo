"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Fuel, MessageCircle, CheckCircle, XCircle, ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const WA_CI = "2250710259146";

interface Vehicle {
  id: string;
  name: string;
  variant: string;
  color: string;
  seats: number;
  fuel: string;
  features: string[];
  priceDay: number;
  priceLong: number;
  imageUrl: string | null;
  images: string[];
  available: boolean;
}

function formatXOF(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function PriceBlock({ priceDay, priceLong }: { priceDay: number; priceLong: number }) {
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    function check() { setMobile(window.innerWidth < 640); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (mobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #E8DDD0" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B5E52", marginBottom: "0.375rem", fontFamily: "var(--font-inter), sans-serif" }}>Court séjour</p>
          <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.5rem", color: "#1C1917" }}>
            {formatXOF(priceDay)}<span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#94a3b8" }}> XOF/j</span>
          </p>
        </div>
        <div style={{ textAlign: "center", padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B5E52", marginBottom: "0.375rem", fontFamily: "var(--font-inter), sans-serif" }}>Long séjour</p>
          <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.5rem", color: "#C8922A" }}>
            {formatXOF(priceLong)}<span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#94a3b8" }}> XOF/j</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ textAlign: "center", padding: "1.25rem", borderRight: "1px solid #E8DDD0" }}>
        <p style={{ fontSize: "0.75rem", color: "#6B5E52", marginBottom: "0.375rem", fontFamily: "var(--font-inter), sans-serif" }}>Court séjour</p>
        <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.4rem", color: "#1C1917" }}>
          {formatXOF(priceDay)}<span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#94a3b8" }}> XOF/j</span>
        </p>
      </div>
      <div style={{ textAlign: "center", padding: "1.25rem" }}>
        <p style={{ fontSize: "0.75rem", color: "#6B5E52", marginBottom: "0.375rem", fontFamily: "var(--font-inter), sans-serif" }}>Long séjour</p>
        <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.4rem", color: "#C8922A" }}>
          {formatXOF(priceLong)}<span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#94a3b8" }}> XOF/j</span>
        </p>
      </div>
    </div>
  );
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80";

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const allImages = vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl ?? PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);

  const waMsg = encodeURIComponent(
    `Bonjour, je souhaite louer le ${vehicle.name} (${vehicle.color}) via AKIL IMMO. Pouvez-vous me confirmer la disponibilité ?`
  );
  const waUrl = `https://wa.me/${WA_CI}?text=${waMsg}`;

  function prev() {
    setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  }

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      {/* pb-24 sur mobile pour ne pas être caché par le bouton WA flottant */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/voitures"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "#6B5E52" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B5E52")}
          >
            <ArrowLeft size={15} />
            Retour aux véhicules
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── GALERIE ── */}
          <div>
            {/* Image principale */}
            <div
              className="relative rounded-2xl overflow-hidden mb-3"
              style={{ aspectRatio: "16/10", backgroundColor: "#E8DDD0" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[activeIndex]}
                alt={`${vehicle.name} ${vehicle.color} — photo ${activeIndex + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Badge disponibilité */}
              <div
                className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: vehicle.available ? "#16A34A" : "#EF4444",
                  color: "#fff",
                }}
              >
                {vehicle.available ? "Disponible" : "Indisponible"}
              </div>

              {/* Badge type */}
              <div
                className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: "rgba(200,146,42,0.9)", color: "#fff" }}
              >
                {vehicle.variant}
              </div>

              {/* Navigations prev/next (si plusieurs images) */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                  {/* Compteur */}
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                    {activeIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Vignettes */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className="shrink-0 rounded-xl overflow-hidden transition-all"
                    style={{
                      width: 72,
                      height: 52,
                      border: `2px solid ${i === activeIndex ? "#C8922A" : "transparent"}`,
                      opacity: i === activeIndex ? 1 : 0.6,
                    }}
                    aria-label={`Voir photo ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFOS + CTA ── */}
          <div className="space-y-5">
            {/* Titre */}
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  color: "#1C1917",
                  lineHeight: 1.2,
                }}
              >
                {vehicle.name}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#6B5E52", fontFamily: "var(--font-inter), sans-serif" }}>
                {vehicle.variant} · {vehicle.color}
              </p>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "#6B5E52" }}>
                <Users size={15} style={{ color: "#C8922A" }} />
                {vehicle.seats} places
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "#6B5E52" }}>
                <Fuel size={15} style={{ color: "#C8922A" }} />
                {vehicle.fuel}
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "#6B5E52" }}>
                <MapPin size={15} style={{ color: "#C8922A" }} />
                Abidjan
              </span>
            </div>

            {/* Prix — empilés sur mobile, côte à côte sur tablette+ */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#FDFCF8", border: "1.5px solid #E8DDD0" }}
            >
              <PriceBlock priceDay={vehicle.priceDay} priceLong={vehicle.priceLong} />
            </div>

            {/* Équipements */}
            {vehicle.features.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#C8922A", letterSpacing: "0.12em" }}>
                  Équipements
                </p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full px-3 py-1 text-sm"
                      style={{
                        backgroundColor: "rgba(200,146,42,0.1)",
                        color: "#A97620",
                        border: "1px solid rgba(200,146,42,0.3)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions rapides */}
            <div className="space-y-2">
              {[
                { ok: true,  text: "Permis de conduire obligatoire" },
                { ok: true,  text: "Assurance & caution incluses" },
                { ok: false, text: "Sortie d'Abidjan non autorisée" },
              ].map(({ ok, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color: "#6B5E52" }}>
                  {ok
                    ? <CheckCircle size={15} style={{ color: "#16A34A", flexShrink: 0 }} />
                    : <XCircle    size={15} style={{ color: "#EF4444", flexShrink: 0 }} />
                  }
                  {text}
                </div>
              ))}
            </div>

            {/* CTA WhatsApp */}
            <a
              href={vehicle.available ? waUrl : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-200"
              style={{
                backgroundColor: vehicle.available ? "#25D366" : "#9CA3AF",
                color: "#fff",
                pointerEvents: vehicle.available ? "auto" : "none",
                fontFamily: "var(--font-inter), sans-serif",
                boxShadow: vehicle.available ? "0 4px 16px rgba(37,211,102,0.35)" : "none",
              }}
              onMouseEnter={(e) => { if (vehicle.available) e.currentTarget.style.backgroundColor = "#1FAB52"; }}
              onMouseLeave={(e) => { if (vehicle.available) e.currentTarget.style.backgroundColor = "#25D366"; }}
            >
              <MessageCircle size={18} />
              {vehicle.available ? "Réserver sur WhatsApp" : "Indisponible pour le moment"}
            </a>

            {vehicle.available && (
              <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                Réponse rapide · Disponibilité confirmée sur WhatsApp
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
