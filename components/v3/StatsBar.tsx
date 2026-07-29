import { FileCheck2, MapPin, ScrollText, KeyRound } from "lucide-react";

export type SiteStats = {
  listingCount: number;      // annonces publiées (biens + terrains)
  verifiedTitleCount: number; // terrains dont le titre a été vérifié
  cityCount: number;          // villes couvertes
};

// Seuil en dessous duquel on n'affiche PAS le chiffre : un compteur trop petit
// affaiblit la preuve. On met alors en avant le PROCESSUS, jamais un faux chiffre.
const MIN_CREDIBLE = 3;

// `metric` = chiffre réel affiché en appui discret (eyebrow doré), seulement
// s'il est crédible. Le titre porte toujours l'engagement, pas le compteur :
// c'est le processus qui rassure la diaspora, pas la taille du catalogue.
type Pillar = {
  icon: typeof FileCheck2;
  metric?: string;
  title: string;
  desc: string;
};

function buildPillars(stats?: SiteStats): Pillar[] {
  const listings = stats?.listingCount ?? 0;
  const titles   = stats?.verifiedTitleCount ?? 0;
  const cities   = stats?.cityCount ?? 0;

  return [
    {
      icon: FileCheck2,
      metric: listings >= MIN_CREDIBLE ? `${listings} annonces` : undefined,
      title: "Chaque annonce contrôlée",
      desc: "Examinée par notre équipe avant sa mise en ligne",
    },
    {
      icon: ScrollText,
      metric: titles >= MIN_CREDIBLE ? `${titles} titres vérifiés` : undefined,
      title: "Titre foncier vérifié",
      desc: "Contrôlé sur pièce, document à l'appui",
    },
    {
      icon: MapPin,
      metric: cities >= MIN_CREDIBLE ? `${cities} villes` : undefined,
      title: "Bénin & Côte d'Ivoire",
      desc: "Cotonou · Abomey-Calavi · Abidjan",
    },
    {
      icon: KeyRound,
      title: "Suivi humain jusqu'aux clés",
      desc: "Un conseiller dédié, sur place ou depuis la diaspora",
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
          {pillars.map(({ icon: Icon, metric, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              {/* Slot toujours réservé pour garder icônes et titres alignés,
                  que le chiffre soit affiché ou non. */}
              <span
                aria-hidden={metric ? undefined : true}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C8922A",
                  marginBottom: "0.6rem",
                  minHeight: "0.85rem",
                  visibility: metric ? "visible" : "hidden",
                }}
              >
                {metric ?? " "}
              </span>
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
