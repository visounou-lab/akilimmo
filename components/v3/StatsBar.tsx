import { FileCheck2, MapPin, ScrollText, KeyRound } from "lucide-react";

export type SiteStats = {
  listingCount: number;      // annonces publiées (biens + terrains)
  verifiedTitleCount: number; // terrains dont le titre a été vérifié
  cityCount: number;          // villes couvertes
};

// Seuil en dessous duquel on préfère un libellé qualitatif à un chiffre trop
// petit pour être crédible. On ne montre JAMAIS un chiffre faible ou faux.
const MIN_CREDIBLE = 3;

type Pillar = { icon: typeof FileCheck2; title: string; desc: string };

function buildPillars(stats?: SiteStats): Pillar[] {
  const listings = stats?.listingCount ?? 0;
  const titles   = stats?.verifiedTitleCount ?? 0;
  const cities   = stats?.cityCount ?? 0;

  return [
    {
      icon: FileCheck2,
      title: listings >= MIN_CREDIBLE ? `${listings} annonces contrôlées` : "Annonces contrôlées",
      desc: "Chaque annonce est examinée avant publication",
    },
    {
      icon: ScrollText,
      title: titles >= MIN_CREDIBLE ? `${titles} titres vérifiés` : "Titres vérifiés sur pièce",
      desc: "Le titre foncier est contrôlé par notre équipe",
    },
    {
      icon: MapPin,
      title: cities >= MIN_CREDIBLE ? `${cities} villes couvertes` : "2 pays couverts",
      desc: "Côte d'Ivoire · Bénin",
    },
    {
      icon: KeyRound,
      title: "Suivi humain",
      desc: "Un conseiller vous accompagne jusqu'aux clés",
    },
  ];
}

export default function StatsBar({ stats }: { stats?: SiteStats }) {
  const pillars = buildPillars(stats);

  return (
    <section
      aria-label="Nos engagements"
      style={{ backgroundColor: "#1C1917" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <dl className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon
                size={26}
                aria-hidden="true"
                style={{ color: "#C8922A", marginBottom: "0.75rem" }}
              />
              <dt
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#FDFCF8",
                  lineHeight: 1.3,
                  marginBottom: "0.4rem",
                }}
              >
                {title}
              </dt>
              <dd
                className="text-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 400,
                  color: "rgba(253,252,248,0.6)",
                  letterSpacing: "0.03em",
                }}
              >
                {desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, #C8922A, transparent)",
          opacity: 0.4,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
