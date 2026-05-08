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
        {/* Warm earthy overlay — distinct from v2's teal/blue */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, rgba(27,77,62,0.92) 0%, rgba(28,25,23,0.78) 60%, rgba(200,146,42,0.35) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
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
          Côte d&apos;Ivoire · Bénin
        </div>

        {/* Headline */}
        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            lineHeight: 1.1,
            color: "#FDFCF8",
            letterSpacing: "-0.01em",
          }}
        >
          Votre maison au pays
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "#C8922A",
            }}
          >
            vous attend.
          </em>
        </h1>

        {/* Slogan */}
        <p
          className="mx-auto mb-4 max-w-2xl text-lg sm:text-xl"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(253,252,248,0.9)",
            lineHeight: 1.6,
          }}
        >
          Vous êtes loin, nous sommes là.
        </p>
        <p
          className="mx-auto mb-10 max-w-xl text-base"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            color: "rgba(253,252,248,0.7)",
            lineHeight: 1.75,
          }}
        >
          Depuis l'étranger, trouvez, visitez et signez votre bien immobilier
          en toute confiance — nous gérons tout sur place pour vous.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#biens"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-4 text-base font-medium transition-all duration-200"
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
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(224,123,57,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E07B39";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(224,123,57,0.45)";
            }}
          >
            Voir les biens disponibles
            <ArrowRight size={16} aria-hidden="true" />
          </a>

          <a
            href="https://wa.me/22900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-4 text-base font-medium transition-all duration-200"
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
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <span
            style={{
              display: "block",
              width: 32,
              height: 1,
              backgroundColor: "#C8922A",
              opacity: 0.6,
            }}
            aria-hidden="true"
          />
          <p
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "rgba(253,252,248,0.45)",
            }}
          >
            Faites défiler
          </p>
          <span
            style={{
              display: "block",
              width: 32,
              height: 1,
              backgroundColor: "#C8922A",
              opacity: 0.6,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
