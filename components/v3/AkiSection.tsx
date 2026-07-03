"use client";

import Image from "next/image";
import { BadgeCheck, ShieldCheck, KeyRound } from "lucide-react";

const TRAITS = [
  {
    icon: BadgeCheck,
    title: "Une sélection attentive",
    description:
      "Notre équipe privilégie des logements documentés avec des informations claires et utiles.",
  },
  {
    icon: ShieldCheck,
    title: "Des informations contrôlées",
    description:
      "Photos, vidéos, équipements et localisation sont examinés avant la mise en avant du bien.",
  },
  {
    icon: KeyRound,
    title: "Un suivi jusqu'aux clés",
    description:
      "AKI symbolise l'accompagnement assuré par notre équipe, du premier contact à la remise des clés.",
  },
];

export default function AkiSection() {
  return (
    <section
      aria-labelledby="aki-heading"
      className="py-14 lg:py-20 overflow-hidden"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Visuel AKI */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div
              className="relative w-full max-w-xs rounded-3xl"
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
                sizes="(max-width: 1024px) 80vw, 320px"
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
              Le gardien de notre promesse
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
              Voici <em style={{ fontStyle: "italic", color: "#1B4D3E" }}>AKI</em>.
              <br />
              Le symbole de notre vigilance.
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
              AKI ne remplace pas nos conseillers : il représente leur engagement
              à vous présenter des informations claires et à suivre votre dossier,
              que vous soyez sur place ou à des milliers de kilomètres.
            </p>

            <ul className="space-y-4" role="list">
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
