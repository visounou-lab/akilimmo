"use client";

import Image from "next/image";
import { MapPin, Users, Fuel, Shield, MessageCircle, ArrowRight, CheckCircle, XCircle } from "lucide-react";

const WA_CI = "2250710259146";

export interface VehicleData {
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

interface Props {
  vehicles: VehicleData[];
}

function waLink(vehicle: VehicleData): string {
  const msg = encodeURIComponent(
    `Bonjour, je souhaite louer le ${vehicle.name} (${vehicle.color}) via AKIL IMMO. Pouvez-vous me confirmer la disponibilité ?`
  );
  return `https://wa.me/${WA_CI}?text=${msg}`;
}

function formatXOF(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80";

export default function VoituresClient({ vehicles }: Props) {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-24 lg:py-32 text-center overflow-hidden"
        style={{ backgroundColor: "#1C1917" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(200,146,42,0.5) 40px,rgba(200,146,42,0.5) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(200,146,42,0.5) 40px,rgba(200,146,42,0.5) 41px)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-medium tracking-widest uppercase"
            style={{
              backgroundColor: "rgba(200,146,42,0.15)",
              border: "1px solid rgba(200,146,42,0.5)",
              color: "#C8922A",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.12em",
            }}
          >
            <MapPin size={12} aria-hidden="true" />
            Abidjan · Côte d&apos;Ivoire
          </div>

          <h1
            className="mb-5"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              color: "#FDFCF8",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Location de SUV premium
            <br />
            <em style={{ color: "#C8922A", fontStyle: "italic" }}>à Abidjan</em>
          </h1>

          <p
            className="mx-auto mb-8 max-w-2xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "rgba(253,252,248,0.65)",
              lineHeight: 1.8,
            }}
          >
            KIA Sportage, Hyundai Tucson, KIA Seltos — des SUVs récents, bien entretenus,
            disponibles à la journée ou en location prolongée.
            Réservation rapide sur WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { label: "Court séjour", price: "70 000 XOF/jour" },
              { label: "Long séjour", price: "60 000 XOF/jour" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl px-6 py-3 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(200,146,42,0.3)",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "rgba(253,252,248,0.5)", fontFamily: "var(--font-inter), sans-serif" }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, color: "#C8922A", fontSize: "1.1rem" }}>
                  {item.price}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#vehicules"
            className="inline-flex items-center gap-2 cursor-pointer rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              backgroundColor: "#C8922A",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(200,146,42,0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A97620")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8922A")}
          >
            Voir les véhicules
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ── Conditions importantes ── */}
      <section style={{ backgroundColor: "#FDFCF8", borderBottom: "1px solid #E8DDD0" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle, color: "#16A34A", text: "Véhicules vérifiés & assurés" },
              { icon: CheckCircle, color: "#16A34A", text: "Permis de conduire obligatoire" },
              { icon: CheckCircle, color: "#16A34A", text: "Réservation WhatsApp en 5 min" },
              { icon: XCircle, color: "#EF4444", text: "Sortie d'Abidjan non autorisée" },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon size={18} style={{ color, flexShrink: 0 }} aria-hidden="true" />
                <p className="text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1C1917" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grille véhicules ── */}
      <section
        id="vehicules"
        aria-labelledby="vehicules-heading"
        className="py-16 lg:py-24"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="mb-2 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A", letterSpacing: "0.14em" }}
            >
              Disponibles maintenant
            </p>
            <h2
              id="vehicules-heading"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: "#1C1917",
              }}
            >
              Nos véhicules disponibles
            </h2>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🚗</p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52", fontSize: "1.05rem" }}>
                Les véhicules seront bientôt disponibles.
              </p>
              <a
                href={`https://wa.me/${WA_CI}?text=${encodeURIComponent("Bonjour, je souhaite avoir des informations sur la location de véhicules AKIL IMMO à Abidjan.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={15} />
                Nous contacter sur WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
                const mainImage = v.imageUrl ?? v.images[0] ?? PLACEHOLDER;
                return (
                  <article
                    key={v.id}
                    className="rounded-2xl overflow-hidden group"
                    style={{
                      backgroundColor: "#FDFCF8",
                      border: "1px solid #E8DDD0",
                      boxShadow: "0 2px 12px rgba(28,25,23,0.06)",
                      opacity: v.available ? 1 : 0.6,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onClick={() => { window.location.href = `/voitures/${v.id}`; }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(28,25,23,0.14)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(28,25,23,0.06)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Image principale */}
                    <div className="relative" style={{ aspectRatio: "16/10" }}>
                      <Image
                        src={mainImage}
                        alt={`${v.name} ${v.color} — location à Abidjan`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div
                        className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: v.available ? "#16A34A" : "#EF4444",
                          color: "#ffffff",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {v.available ? "Disponible" : "Indisponible"}
                      </div>
                      <div
                        className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: "rgba(200,146,42,0.9)", color: "#ffffff", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {v.variant}
                      </div>
                    </div>

                    {/* Corps */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <h3
                          style={{
                            fontFamily: "var(--font-playfair), serif",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "#1C1917",
                          }}
                        >
                          {v.name}
                        </h3>
                      </div>
                      <p className="text-xs mb-4" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
                        {v.variant} · {v.color}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
                          <Users size={14} aria-hidden="true" />
                          {v.seats} places
                        </span>
                        <span className="flex items-center gap-1.5 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
                          <Fuel size={14} aria-hidden="true" />
                          {v.fuel}
                        </span>
                      </div>

                      {v.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {v.features.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="rounded-full px-2.5 py-0.5 text-xs"
                              style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                backgroundColor: "rgba(200,146,42,0.1)",
                                color: "#A97620",
                                border: "1px solid rgba(200,146,42,0.25)",
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      <div
                        className="rounded-xl p-4 mb-5 flex items-center justify-between"
                        style={{ backgroundColor: "#F5F0E8" }}
                      >
                        <div className="text-center">
                          <p className="text-xs mb-0.5" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
                            Court séjour
                          </p>
                          <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, color: "#1C1917", fontSize: "1rem" }}>
                            {formatXOF(v.priceDay)}<span className="text-xs font-normal"> XOF/j</span>
                          </p>
                        </div>
                        <div style={{ width: 1, height: 32, backgroundColor: "#E8DDD0" }} aria-hidden="true" />
                        <div className="text-center">
                          <p className="text-xs mb-0.5" style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}>
                            Long séjour
                          </p>
                          <p style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, color: "#C8922A", fontSize: "1rem" }}>
                            {formatXOF(v.priceLong)}<span className="text-xs font-normal"> XOF/j</span>
                          </p>
                        </div>
                      </div>

                      <a
                        href={v.available ? waLink(v) : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!v.available}
                        className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontWeight: 500,
                          color: "#ffffff",
                          backgroundColor: v.available ? "#25D366" : "#9CA3AF",
                          pointerEvents: v.available ? "auto" : "none",
                        }}
                        onMouseEnter={(e) => { if (v.available) e.currentTarget.style.backgroundColor = "#1FAB52"; }}
                        onMouseLeave={(e) => { if (v.available) e.currentTarget.style.backgroundColor = "#25D366"; }}
                      >
                        <MessageCircle size={15} aria-hidden="true" />
                        {v.available ? "Réserver sur WhatsApp" : "Indisponible"}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Bloc conditions ── */}
      <section className="py-16" style={{ backgroundColor: "#1C1917" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 flex items-center justify-center gap-3" aria-hidden="true">
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A", opacity: 0.5 }} />
            <Shield size={18} style={{ color: "#C8922A" }} />
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A", opacity: 0.5 }} />
          </div>

          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "#FDFCF8",
            }}
          >
            Conditions de location
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mt-8 text-left max-w-2xl mx-auto">
            {[
              { ok: true,  text: "Permis de conduire valide obligatoire" },
              { ok: true,  text: "Caution demandée à la remise des clés" },
              { ok: true,  text: "Assurance incluse dans le tarif" },
              { ok: true,  text: "Carburant à la charge du locataire" },
              { ok: true,  text: "Véhicule remis propre, rendu propre" },
              { ok: false, text: "Sortie d'Abidjan strictement interdite" },
            ].map(({ ok, text }) => (
              <div key={text} className="flex items-start gap-3">
                {ok
                  ? <CheckCircle size={16} style={{ color: "#16A34A", flexShrink: 0, marginTop: 2 }} />
                  : <XCircle    size={16} style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                }
                <p className="text-sm" style={{ fontFamily: "var(--font-inter), sans-serif", color: "rgba(253,252,248,0.75)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/${WA_CI}?text=${encodeURIComponent("Bonjour, j'aimerais louer un véhicule à Abidjan via AKIL IMMO. Quelles sont les disponibilités ?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 cursor-pointer rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              backgroundColor: "#C8922A",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A97620")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C8922A")}
          >
            <MessageCircle size={15} aria-hidden="true" />
            Contacter AKIL IMMO pour louer
          </a>
        </div>
      </section>
    </>
  );
}
