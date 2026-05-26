"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import WaCountryPicker from "../WaCountryPicker";

export default function PageHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(150deg, rgba(27,77,62,0.92) 0%, rgba(28,25,23,0.78) 60%, rgba(200,146,42,0.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-medium tracking-widest uppercase"
          style={{
            backgroundColor: "rgba(200,146,42,0.18)",
            border: "1px solid rgba(200,146,42,0.55)",
            color: "#C8922A",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          Pour les propriétaires
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            lineHeight: 1.15,
            color: "#FDFCF8",
            letterSpacing: "-0.01em",
          }}
        >
          <em style={{ fontStyle: "italic", color: "#C8922A" }}>Confiez</em> votre bien meublé
          <br />
          à AKIL IMMO — on s&apos;occupe du reste.
        </h1>

        <p
          className="mx-auto mb-10 max-w-2xl text-base sm:text-lg"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            color: "rgba(253,252,248,0.75)",
            lineHeight: 1.8,
          }}
        >
          Propriétaires en Côte d&apos;Ivoire et au Bénin — gérez vos locations
          à distance avec zéro stress. De la mise en ligne à la réservation,
          nous pilotons tout en votre nom.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/inscription"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-4 text-base transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "#E07B39",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(224,123,57,0.45)",
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
            Déposer mon bien gratuitement
            <ArrowRight size={16} aria-hidden="true" />
          </a>

          <WaCountryPicker
            message="Bonjour, je souhaite en savoir plus sur la mise en location avec AKIL IMMO"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-4 text-base transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#FDFCF8",
              border: "1.5px solid rgba(253,252,248,0.45)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8922A";
              e.currentTarget.style.color = "#C8922A";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(253,252,248,0.45)";
              e.currentTarget.style.color = "#FDFCF8";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            Parler à un conseiller
          </WaCountryPicker>
        </div>
      </div>
    </section>
  );
}
