"use client";

import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
          alt="Belle villa dans un quartier résidentiel en Afrique de l'Ouest"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,118,110,0.88) 0%, rgba(3,105,161,0.75) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
          style={{
            backgroundColor: "rgba(20,184,166,0.25)",
            border: "1px solid #14B8A6",
            color: "#CCFBF1",
            fontFamily: "var(--font-josefin), sans-serif",
          }}
        >
          Côte d&apos;Ivoire · Bénin
        </div>

        {/* Headline */}
        <h1
          className="mb-6 text-4xl sm:text-5xl lg:text-7xl leading-tight"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700,
            color: "#F0FDFA",
            letterSpacing: "-0.02em",
          }}
        >
          Votre maison au pays
          <br />
          <span style={{ color: "#14B8A6" }}>vous attend.</span>
        </h1>

        {/* Slogan */}
        <p
          className="mx-auto mb-4 max-w-2xl text-lg sm:text-xl leading-relaxed"
          style={{
            fontFamily: "var(--font-josefin), sans-serif",
            fontWeight: 300,
            color: "#CCFBF1",
            letterSpacing: "0.02em",
          }}
        >
          Vous êtes loin, nous sommes là.
        </p>
        <p
          className="mx-auto mb-10 max-w-xl text-base sm:text-lg leading-relaxed"
          style={{
            fontFamily: "var(--font-josefin), sans-serif",
            fontWeight: 300,
            color: "rgba(204,251,241,0.80)",
          }}
        >
          Depuis l'étranger, trouvez, visitez et signez votre bien immobilier
          en toute confiance — nous gérons tout sur place pour vous.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#biens"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-6 py-3.5 text-base font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              backgroundColor: "#0369A1",
              color: "#ffffff",
              letterSpacing: "0.03em",
              boxShadow: "0 4px 14px rgba(3,105,161,0.45)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0284C7";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0369A1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Voir les biens disponibles
            <ArrowRight size={16} aria-hidden="true" />
          </a>

          <a
            href="https://wa.me/22900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-6 py-3.5 text-base font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              backgroundColor: "transparent",
              color: "#F0FDFA",
              border: "2px solid #14B8A6",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(20,184,166,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            Parler à un conseiller
          </a>
        </div>

        {/* Scroll hint */}
        <p
          className="mt-12 text-xs tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-josefin), sans-serif",
            color: "rgba(204,251,241,0.55)",
          }}
        >
          Faites défiler pour découvrir
        </p>
      </div>
    </section>
  );
}
