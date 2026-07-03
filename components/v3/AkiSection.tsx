"use client";

import Image from "next/image";
import { Search, ShieldCheck, KeyRound } from "lucide-react";

const TRAITS = [
  {
    icon: Search,
    title: "Il cherche pour vous",
    description:
      "AKI parcourt notre catalogue et repère les biens qui correspondent vraiment à votre besoin, sans perte de temps.",
  },
  {
    icon: ShieldCheck,
    title: "Il vérifie chaque bien",
    description:
      "Photos, vidéos, équipements, quartier — rien n'est mis en ligne avant d'être contrôlé par notre équipe.",
  },
  {
    icon: KeyRound,
    title: "Il vous remet la clé",
    description:
      "Une fois la réservation confirmée, AKI reste le symbole d'un dossier suivi jusqu'à la remise des clés.",
  },
];

export default function AkiSection() {
  return (
    <section
      aria-labelledby="aki-heading"
      className="py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visuel AKI */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div
              className="relative w-full max-w-sm rounded-3xl"
              style={{
                backgroundColor: "#FBEEE2",
                border: "1px solid #E8DDD0",
                boxShadow: "0 12px 40px rgba(28,25,23,0.08)",
              }}
            >
              <Image
                src="/brand/aki/aki-master-concept-v1.png"
                alt="AKI, la mascotte d'AKIL IMMO, maison stylisée verte et ivoire tenant une clé dorée"
                width={1254}
                height={1254}
                className="w-full h-auto rounded-3xl"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>
          </div>

          {/* Texte */}
          <div className="order-1 lg:order-2">
            <p
              className="mb-3 text-xs font-medium tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#C8922A",
                letterSpacing: "0.14em",
              }}
            >
              Notre mascotte
            </p>
            <h2
              id="aki-heading"
              className="mb-5"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "#1C1917",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Rencontrez <em style={{ fontStyle: "italic", color: "#1B4D3E" }}>AKI</em>.
              <br />
              Chaque bien mérite d&apos;être vérifié.
            </h2>
            <p
              className="mb-8 max-w-lg text-base"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 300,
                color: "#6B5E52",
                lineHeight: 1.8,
              }}
            >
              AKI incarne notre promesse : des logements meublés sélectionnés avec
              soin, du premier contact jusqu&apos;à la remise des clés — que vous
              soyez à Cotonou, à Abidjan, ou à des milliers de kilomètres.
            </p>

            <ul className="space-y-5" role="list">
              {TRAITS.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-4">
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "rgba(27,77,62,0.08)",
                      border: "1px solid rgba(200,146,42,0.3)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={20} style={{ color: "#1B4D3E" }} />
                  </div>
                  <div>
                    <p
                      className="mb-1"
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontWeight: 600,
                        fontSize: "1.05rem",
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
