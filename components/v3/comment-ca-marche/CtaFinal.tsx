"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import WaCountryPicker from "../WaCountryPicker";

export default function CtaFinal() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 lg:py-24 px-4 text-center"
      style={{ backgroundColor: "#1C1917" }}
    >
      {/* Gold ornament */}
      <div
        className="mx-auto mb-6 flex items-center justify-center gap-3"
        aria-hidden="true"
      >
        <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
        <span
          style={{
            display: "block",
            width: 8,
            height: 8,
            backgroundColor: "#C8922A",
            borderRadius: "50%",
            opacity: 0.8,
          }}
        />
        <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
      </div>

      <h2
        id="cta-heading"
        className="mb-4 mx-auto max-w-2xl"
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontWeight: 700,
          fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
          color: "#FDFCF8",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        Prêt à mettre votre bien en location ?
      </h2>

      <p
        className="mb-10 mx-auto max-w-xl text-base"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 300,
          color: "rgba(253,252,248,0.6)",
          lineHeight: 1.75,
        }}
      >
        Rejoignez les propriétaires qui font confiance à AKIL IMMO pour gérer
        leurs biens à distance. Inscription gratuite, publication en 48 h,
        zéro frais cachés.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/inscription"
          className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm transition-all duration-200"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500,
            backgroundColor: "#E07B39",
            color: "#ffffff",
            boxShadow: "0 4px 16px rgba(224,123,57,0.4)",
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
          <ArrowRight size={15} aria-hidden="true" />
        </a>

        <WaCountryPicker
          message="Bonjour, je souhaite mettre mon bien en location avec AKIL IMMO"
          className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm transition-all duration-200"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500,
            backgroundColor: "transparent",
            color: "#FDFCF8",
            border: "1.5px solid rgba(200,146,42,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C8922A";
            e.currentTarget.style.color = "#C8922A";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(200,146,42,0.5)";
            e.currentTarget.style.color = "#FDFCF8";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <MessageCircle size={15} aria-hidden="true" />
          Discuter sur WhatsApp
        </WaCountryPicker>
      </div>
    </section>
  );
}
