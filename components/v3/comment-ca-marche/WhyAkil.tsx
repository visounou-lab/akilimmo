import { ShieldCheck, Globe, TrendingUp } from "lucide-react";

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: "Zéro frais cachés",
    description:
      "L'inscription est entièrement gratuite. AKIL IMMO ne perçoit qu'une commission sur les réservations confirmées — vous ne payez que quand vous gagnez.",
  },
  {
    icon: Globe,
    title: "Visibilité diaspora",
    description:
      "Votre bien est visible par des locataires de la diaspora africaine et des expatriés du monde entier, une audience que vous ne pouvez pas atteindre seul.",
  },
  {
    icon: TrendingUp,
    title: "Prix optimisé par le marché",
    description:
      "Vous proposez votre prix, notre équipe vous conseille sur le tarif optimal selon la demande locale et la saisonnalité pour maximiser votre taux d'occupation.",
  },
];

export default function WhyAkil() {
  return (
    <section
      aria-labelledby="why-heading"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "#1B4D3E" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="mx-auto mb-5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A", opacity: 0.7 }} />
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
            <span style={{ display: "block", width: 40, height: 1, backgroundColor: "#C8922A", opacity: 0.7 }} />
          </div>

          <p
            className="mb-4 text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#C8922A",
              letterSpacing: "0.16em",
            }}
          >
            Pourquoi nous choisir
          </p>

          <h2
            id="why-heading"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#FDFCF8",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Les avantages AKIL IMMO.
          </h2>

          <p
            className="mt-5 mx-auto max-w-xl text-base"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "rgba(253,252,248,0.65)",
              lineHeight: 1.8,
            }}
          >
            Une plateforme pensée pour les propriétaires absents qui veulent
            louer en toute confiance sans se déplacer.
          </p>
        </div>

        {/* Cards */}
        <ul className="grid gap-6 sm:grid-cols-3" role="list">
          {ADVANTAGES.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <div
                className="flex flex-col gap-5 rounded-2xl p-7 h-full"
                style={{
                  backgroundColor: "rgba(253,252,248,0.06)",
                  border: "1px solid rgba(200,146,42,0.25)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl self-start"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "rgba(200,146,42,0.15)",
                    border: "1px solid rgba(200,146,42,0.35)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={22} style={{ color: "#C8922A" }} />
                </div>

                <div>
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: "1.05rem",
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
                      color: "rgba(253,252,248,0.6)",
                      lineHeight: 1.75,
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
