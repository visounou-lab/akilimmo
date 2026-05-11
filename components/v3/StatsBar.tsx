import { Building2, CalendarCheck, MapPin, Zap } from "lucide-react";

const STATS = [
  { icon: Building2, value: "350+", label: "Biens gérés", ariaLabel: "Plus de 350 biens gérés" },
  { icon: CalendarCheck, value: "8 ans", label: "D'expérience", ariaLabel: "8 ans d'expérience" },
  { icon: MapPin, value: "2 pays", label: "Côte d'Ivoire · Bénin", ariaLabel: "Présence en Côte d'Ivoire et au Bénin" },
  { icon: Zap, value: "24h", label: "Délai de réponse", ariaLabel: "Délai de réponse de 24 heures" },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Chiffres clés AKIL IMMO"
      style={{ backgroundColor: "#1B4D3E" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <dl className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label, ariaLabel }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center"
              aria-label={ariaLabel}
            >
              <Icon
                size={26}
                aria-hidden="true"
                style={{ color: "#C8922A", marginBottom: "0.6rem" }}
              />
              <dt
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "2rem",
                  color: "#FDFCF8",
                  lineHeight: 1,
                }}
              >
                {value}
              </dt>
              <dd
                className="mt-2 text-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 400,
                  color: "rgba(253,252,248,0.65)",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Gold separator line */}
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
