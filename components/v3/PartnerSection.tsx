"use client";

import { LayoutDashboard, Tag, Globe, ArrowRight, Users } from "lucide-react";

const CARDS = [
  {
    icon: LayoutDashboard,
    title: "Tableau de bord dédié",
    description:
      "Espace propriétaire en ligne pour gérer vos biens, suivre les demandes de location, consulter vos revenus et accéder à vos documents à tout moment.",
    ariaLabel: "Tableau de bord dédié",
  },
  {
    icon: Tag,
    title: "Commission avantageuse",
    description:
      "Conditions de lancement préférentielles pour nos partenaires fondateurs. Vous gardez la main sur votre rendement locatif.",
    ariaLabel: "Commission avantageuse",
  },
  {
    icon: Globe,
    title: "Diffusion ciblée",
    description:
      "Votre bien visible auprès de la diaspora à Paris, Bruxelles, Montréal et au-delà, ainsi que des expat's en mission et des locaux à la recherche de meublé qualité.",
    ariaLabel: "Diffusion internationale",
  },
];

export default function PartnerSection() {
  return (
    <section
      aria-labelledby="partner-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#1B4D3E" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          {/* Icon */}
          <div
            className="mx-auto mb-5 flex items-center justify-center rounded-full"
            style={{
              width: 52,
              height: 52,
              backgroundColor: "rgba(200,146,42,0.15)",
              border: "1px solid rgba(200,146,42,0.4)",
            }}
            aria-hidden="true"
          >
            <Users size={24} style={{ color: "#C8922A" }} />
          </div>

          <p
            className="mb-4 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.16em",
            }}
          >
            Propriétaires &amp; Agences
          </p>

          <h2
            id="partner-heading"
            className="mx-auto max-w-3xl"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#FDFCF8",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Vous avez un bien meublé à louer ?{" "}
            <em style={{ fontStyle: "italic", color: "#C8922A" }}>
              Nous trouvons vos locataires.
            </em>
          </h2>

          <p
            className="mt-5 mx-auto max-w-2xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "rgba(253,252,248,0.7)",
              lineHeight: 1.8,
            }}
          >
            Que vous soyez propriétaire d&apos;une villa, d&apos;un appartement,
            ou agence immobilière avec plusieurs biens en stock, AKIL IMMO diffuse
            votre offre auprès d&apos;une clientèle qualifiée — diaspora, expat&apos;s
            et locaux. Validation qualité, mise en ligne professionnelle, gestion
            locative complète si vous le souhaitez.
          </p>
        </div>

        {/* Mini-cards */}
        <ul className="grid gap-5 sm:grid-cols-3 mb-12" role="list">
          {CARDS.map(({ icon: Icon, title, description, ariaLabel }) => (
            <li key={title}>
              <div
                className="flex flex-col gap-4 rounded-2xl p-6 h-full transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: "rgba(253,252,248,0.06)",
                  border: "1px solid rgba(200,146,42,0.25)",
                }}
                aria-label={ariaLabel}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(253,252,248,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(200,146,42,0.55)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(253,252,248,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(200,146,42,0.25)";
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl self-start"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "rgba(200,146,42,0.15)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={20} style={{ color: "#C8922A" }} />
                </div>

                {/* Text */}
                <div>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#FDFCF8",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      color: "rgba(253,252,248,0.65)",
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
            Devenir partenaire
            <ArrowRight size={15} aria-hidden="true" />
          </a>

          <a
            href="#comment-ca-marche"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#FDFCF8",
              border: "1.5px solid rgba(253,252,248,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FDFCF8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(253,252,248,0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Découvrir le programme
          </a>
        </div>
      </div>
    </section>
  );
}
