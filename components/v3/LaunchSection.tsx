"use client";

import { Users, Star, MessageCircle, ArrowRight } from "lucide-react";
import WaCountryPicker from "./WaCountryPicker";

const CARDS = [
  {
    icon: Users,
    title: "Communauté pionnière",
    description:
      "Soyez parmi les premiers locataires, propriétaires et agences à utiliser AKIL IMMO en Côte d'Ivoire et au Bénin.",
  },
  {
    icon: Star,
    title: "Conditions privilégiées",
    description:
      "Tarifs et avantages de lancement réservés aux partenaires fondateurs qui nous rejoignent dès aujourd'hui.",
  },
  {
    icon: MessageCircle,
    title: "Votre voix compte",
    description:
      "Vos retours façonnent directement la plateforme. Échange direct avec l'équipe via WhatsApp pour faire évoluer le service.",
  },
];

export default function LaunchSection() {
  return (
    <section
      aria-labelledby="launch-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          {/* Gold ornament */}
          <div
            className="mx-auto mb-5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A" }} />
            <span
              style={{
                display: "block",
                width: 8,
                height: 8,
                backgroundColor: "#C8922A",
                borderRadius: "50%",
              }}
            />
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A" }} />
          </div>

          <p
            className="mb-4 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.16em",
            }}
          >
            Phase de lancement
          </p>

          <h2
            id="launch-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#1C1917",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Rejoignez nos premiers utilisateurs.
          </h2>

          <p
            className="mt-5 mx-auto max-w-2xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "#6B5E52",
              lineHeight: 1.8,
            }}
          >
            AKIL IMMO ouvre ses portes à une communauté pionnière de locataires,
            propriétaires et agences immobilières. Bénéficiez des conditions de
            lancement et participez à la construction d&apos;une plateforme pensée
            pour la diaspora et les expat&apos;s.
          </p>
        </div>

        {/* Mini-cards */}
        <ul className="grid gap-6 sm:grid-cols-3 mb-12" role="list">
          {CARDS.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <div
                className="flex flex-col gap-4 rounded-2xl p-6 h-full transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: "#F5F0E8",
                  border: "1px solid #E8DDD0",
                  boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 20px rgba(28,25,23,0.09)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#C8922A";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 8px rgba(28,25,23,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl self-start"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "rgba(200,146,42,0.12)",
                    border: "1px solid rgba(200,146,42,0.3)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={20} style={{ color: "#C8922A" }} />
                </div>

                <div>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#1C1917",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      color: "#6B5E52",
                      lineHeight: 1.7,
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/inscription"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "#E07B39",
              color: "#ffffff",
              boxShadow: "0 4px 16px rgba(224,123,57,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C96A28";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E07B39";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Rejoindre la communauté
            <ArrowRight size={15} aria-hidden="true" />
          </a>

          <WaCountryPicker
            message="Bonjour, je souhaite en savoir plus sur AKIL IMMO"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#1B4D3E",
              border: "1.5px solid #1B4D3E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1B4D3E";
              e.currentTarget.style.color = "#FDFCF8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#1B4D3E";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MessageCircle size={15} aria-hidden="true" />
            Parler à l&apos;équipe
          </WaCountryPicker>
        </div>
      </div>
    </section>
  );
}
