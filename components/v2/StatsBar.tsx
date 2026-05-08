import { Building2, CalendarCheck, MapPin, Headset } from "lucide-react";

const STATS = [
  {
    icon: Building2,
    value: "350+",
    label: "Biens gérés",
    ariaLabel: "Plus de 350 biens gérés",
  },
  {
    icon: CalendarCheck,
    value: "8 ans",
    label: "D'expérience",
    ariaLabel: "8 ans d'expérience",
  },
  {
    icon: MapPin,
    value: "2 pays",
    label: "Côte d'Ivoire · Bénin",
    ariaLabel: "Présence en Côte d'Ivoire et au Bénin",
  },
  {
    icon: Headset,
    value: "100%",
    label: "Suivi à distance",
    ariaLabel: "100% suivi à distance",
  },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Chiffres clés AKIL IMMO"
      style={{ backgroundColor: "#0F766E" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <dl className="grid grid-cols-2 gap-y-8 gap-x-6 md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label, ariaLabel }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center"
              aria-label={ariaLabel}
            >
              <Icon
                size={28}
                aria-hidden="true"
                style={{ color: "#14B8A6", marginBottom: "0.5rem" }}
              />
              <dt
                className="text-3xl font-bold"
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  color: "#F0FDFA",
                }}
              >
                {value}
              </dt>
              <dd
                className="mt-1 text-sm font-medium tracking-wide"
                style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  color: "#CCFBF1",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
