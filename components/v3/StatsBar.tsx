import { FileCheck2, MapPin, MessageCircle, KeyRound } from "lucide-react";

const PILLARS = [
  {
    icon: FileCheck2,
    title: "Biens documentés",
    desc: "Photos, vidéos et informations utiles",
  },
  {
    icon: MapPin,
    title: "2 pays couverts",
    desc: "Côte d'Ivoire · Bénin",
  },
  {
    icon: MessageCircle,
    title: "Contact direct",
    desc: "Un conseiller vous répond sur WhatsApp",
  },
  {
    icon: KeyRound,
    title: "Suivi humain",
    desc: "Du premier contact à la remise des clés",
  },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Nos engagements"
      style={{ backgroundColor: "#1C1917" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <dl className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
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
