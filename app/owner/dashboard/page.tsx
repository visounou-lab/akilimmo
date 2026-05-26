import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const ADVISOR = {
  name:     "David Ayina",
  initials: "DA",
  title:    "Directeur Commercial · AKIL IMMO",
};

const WA_BY_COUNTRY: Record<string, string> = {
  COTE_D_IVOIRE: "2250710259146",
  BENIN:         "2290197598682",
};

function advisorWhatsApp(ownerName: string, country?: string | null) {
  const phone = WA_BY_COUNTRY[country ?? ""] ?? WA_BY_COUNTRY.BENIN;
  const msg = `Bonjour David, je suis ${ownerName} et je souhaite vous parler de mes biens sur AKIL IMMO.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

const STATUS_BADGE: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  RENTED:     { label: "Loué",        dot: "#10B981", bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  RESERVED:   { label: "Partiel",     dot: "#F59E0B", bg: "rgba(245,158,11,0.1)",  text: "#D97706" },
  AVAILABLE:  { label: "Disponible",  dot: "#3B82F6", bg: "rgba(59,130,246,0.1)",  text: "#2563EB" },
  OFF_MARKET: { label: "Hors marché", dot: "#94A3B8", bg: "rgba(148,163,184,0.1)", text: "#64748B" },
};

const DOC_TYPES = [
  { type: "quittance", label: "Quittance mensuelle",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { type: "contrat",   label: "Contrat de location",   icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { type: "releve",    label: "Relevé annuel",          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export default async function OwnerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId   = (session.user as { id: string }).id;
  const userName = session.user.name ?? "Propriétaire";
  const firstName = userName.split(" ").at(-1) ?? userName;

  const now          = new Date();
  const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrev    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel   = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  const [ownerUser, properties, currentRevAgg, prevRevAgg, rentedCount, recentActivity] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { country: true } }),
    prisma.property.findMany({
      where:   { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        images:    { where: { isPrimary: true }, take: 1 },
        contracts: { where: { status: "ACTIVE" }, select: { endDate: true, rentAmount: true }, take: 1 },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startCurrent }, contract: { ownerId: userId } },
      _sum:  { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startPrev, lt: startCurrent }, contract: { ownerId: userId } },
      _sum:  { amount: true },
    }),
    prisma.contract.count({ where: { ownerId: userId, status: "ACTIVE" } }),
    prisma.notification.findMany({
      where:   { userId, createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: "desc" },
      take:    5,
      select:  { id: true, title: true, body: true, category: true, createdAt: true },
    }),
  ]);

  const currentRevenue = Number(currentRevAgg._sum.amount ?? 0);
  const prevRevenue    = Number(prevRevAgg._sum.amount ?? 0);
  const percentChange  = prevRevenue > 0
    ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
    : null;
  const totalCount     = properties.length;
  const occupancyRate  = totalCount > 0 ? Math.round((rentedCount / totalCount) * 100) : 0;
  const whatsappUrl    = advisorWhatsApp(userName, ownerUser?.country);

  const card: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    border:          "1.5px solid rgba(200,146,42,0.15)",
    borderRadius:    16,
    boxShadow:       "0 1px 8px rgba(28,25,23,0.05)",
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily:    "var(--font-inter), sans-serif",
    fontSize:      "0.65rem",
    fontWeight:    700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color:         "#C8922A",
  };

  return (
    <div
      className="min-h-screen px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
      style={{ backgroundColor: "#FDFCF8" }}
    >
      <div className="max-w-5xl mx-auto space-y-7">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p style={{ ...sectionLabel, marginBottom: 6 }}>
              {new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(now)}
            </p>
            <h1
              style={{
                fontFamily:    "var(--font-playfair), serif",
                fontSize:      "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight:    700,
                color:         "#1C1917",
                letterSpacing: "-0.01em",
                lineHeight:    1.2,
              }}
            >
              Bonjour, {firstName}
            </h1>
            <p
              className="mt-1"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#78716C" }}
            >
              Voici l&apos;état de votre patrimoine ce mois
            </p>
          </div>

          <Link
            href="/owner/dashboard/soumettre"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: "#C8922A",
              color:           "#FFFFFF",
              boxShadow:       "0 2px 10px rgba(200,146,42,0.35)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Soumettre un bien</span>
            <span className="sm:hidden">Nouveau</span>
          </Link>
        </div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Revenus du mois */}
          <div className="col-span-2 lg:col-span-1 p-5" style={card}>
            <p style={sectionLabel}>Revenus — {monthLabel}</p>
            <div className="mt-3 flex items-end gap-3">
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize:   "clamp(1.6rem, 3vw, 2.2rem)",
                  color:      "#1C1917",
                  lineHeight: 1,
                }}
              >
                {new Intl.NumberFormat("fr-FR").format(Math.round(currentRevenue))}
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 400,
                    fontSize:   "0.875rem",
                    color:      "#A8A29E",
                    marginLeft: 4,
                  }}
                >
                  FCFA
                </span>
              </span>
            </div>

            {percentChange !== null && (
              <span
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: percentChange >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  color:           percentChange >= 0 ? "#059669" : "#DC2626",
                }}
              >
                {percentChange >= 0 ? "↗" : "↘"}{" "}
                {percentChange >= 0 ? "+" : ""}{percentChange}% vs mois dernier
              </span>
            )}

            <div
              className="flex items-center gap-2 mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(200,146,42,0.12)" }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#10B981" }} />
              <span
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", color: "#78716C" }}
              >
                <strong style={{ color: "#1C1917" }}>{rentedCount}</strong> bien{rentedCount !== 1 ? "s" : ""} loué{rentedCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Portefeuille */}
          <div className="p-5" style={card}>
            <p style={sectionLabel}>Portefeuille</p>
            <div className="mt-3">
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize:   "2.2rem",
                  color:      "#1C1917",
                  lineHeight: 1,
                }}
              >
                {totalCount}
              </span>
              <p
                className="mt-1"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", color: "#A8A29E" }}
              >
                bien{totalCount !== 1 ? "s" : ""} enregistré{totalCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div
              className="flex items-center gap-2 mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(200,146,42,0.12)" }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#C8922A" }} />
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", color: "#78716C" }}>
                <strong style={{ color: "#1C1917" }}>{totalCount - rentedCount}</strong> disponible{totalCount - rentedCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Taux d'occupation */}
          <div className="p-5" style={card}>
            <p style={sectionLabel}>Taux d&apos;occupation</p>
            <div className="mt-3">
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize:   "2.2rem",
                  color:      "#1C1917",
                  lineHeight: 1,
                }}
              >
                {occupancyRate}
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 400,
                    fontSize:   "1.1rem",
                    color:      "#A8A29E",
                  }}
                >
                  %
                </span>
              </span>
              <p
                className="mt-1"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", color: "#A8A29E" }}
              >
                des biens loués
              </p>
            </div>
            {/* Barre de progression */}
            <div className="mt-4">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(200,146,42,0.15)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width:           `${occupancyRate}%`,
                    backgroundColor: occupancyRate >= 70 ? "#10B981" : occupancyRate >= 40 ? "#C8922A" : "#F59E0B",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mes biens ── */}
        <div style={card} className="overflow-hidden">
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(200,146,42,0.1)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(200,146,42,0.12)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize:   "0.9375rem",
                  color:      "#1C1917",
                }}
              >
                Mes biens
              </h2>
            </div>
            <Link
              href="/owner/dashboard/biens"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize:   "0.8125rem",
                color:      "#C8922A",
                fontWeight: 500,
              }}
              className="hover:underline"
            >
              Voir tout →
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(200,146,42,0.08)" }}
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#A8A29E" }}
              >
                Aucun bien enregistré.
              </p>
              <Link
                href="/owner/dashboard/soumettre"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: "#C8922A" }}
              >
                Soumettre votre premier bien →
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(200,146,42,0.08)" }}>
              {properties.slice(0, 5).map((p) => {
                const badge   = STATUS_BADGE[p.status] ?? STATUS_BADGE.OFF_MARKET;
                const heroUrl = p.images[0]?.url ?? null;
                const contract = p.contracts[0];
                const price   = new Intl.NumberFormat("fr-FR").format(Number(p.price));

                return (
                  <Link
                    key={p.id}
                    href="/owner/dashboard/biens"
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[rgba(200,146,42,0.04)]"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                      style={{ backgroundColor: "rgba(200,146,42,0.08)" }}
                    >
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={heroUrl} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={1.5} opacity={0.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className="line-clamp-1"
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontWeight: 500,
                            fontSize:   "0.9rem",
                            color:      "#1C1917",
                          }}
                        >
                          {p.title}
                        </p>
                        <span
                          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: badge.bg, color: badge.text }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: badge.dot }}
                          />
                          {badge.label}
                        </span>
                      </div>
                      <p
                        className="mt-0.5"
                        style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#A8A29E" }}
                      >
                        {contract?.endDate
                          ? `Jusqu'au ${new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(contract.endDate))} · `
                          : ""}
                        {price} FCFA/nuit
                      </p>
                    </div>

                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={2} opacity={0.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bas de page : 2 colonnes ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Activité récente */}
          {recentActivity.length > 0 && (
            <div style={card} className="overflow-hidden">
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(200,146,42,0.1)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(200,146,42,0.12)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 600,
                      fontSize:   "0.9375rem",
                      color:      "#1C1917",
                    }}
                  >
                    Activité récente
                  </h2>
                </div>
                <Link
                  href="/owner/dashboard/notifications"
                  style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", color: "#C8922A", fontWeight: 500 }}
                  className="hover:underline"
                >
                  Tout voir →
                </Link>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(200,146,42,0.08)" }}>
                {recentActivity.map((notif) => {
                  const daysAgo = Math.floor((now.getTime() - notif.createdAt.getTime()) / 86_400_000);
                  const catColor =
                    notif.category === "PAYMENT" ? "#3B82F6"
                    : notif.category === "BOOKING" ? "#10B981"
                    : "#8B5CF6";
                  const catBg =
                    notif.category === "PAYMENT" ? "rgba(59,130,246,0.1)"
                    : notif.category === "BOOKING" ? "rgba(16,185,129,0.1)"
                    : "rgba(139,92,246,0.1)";

                  return (
                    <div key={notif.id} className="flex items-start gap-3 px-6 py-3.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: catBg }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="leading-snug"
                          style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "#1C1917" }}
                        >
                          {notif.title}
                        </p>
                        <p
                          className="mt-0.5 truncate"
                          style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#A8A29E" }}
                        >
                          {notif.body}
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-xs mt-0.5"
                        style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {daysAgo === 0 ? "Aujourd'hui" : `Il y a ${daysAgo}j`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colonne droite : conseiller + documents */}
          <div className="space-y-5">

            {/* Conseiller */}
            <div
              className="p-5 flex items-center gap-4"
              style={{
                ...card,
                background: "linear-gradient(135deg, #FFFFFF 0%, rgba(200,146,42,0.04) 100%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(200,146,42,0.15)", border: "2px solid rgba(200,146,42,0.3)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    fontSize:   "1rem",
                    color:      "#C8922A",
                  }}
                >
                  {ADVISOR.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p style={sectionLabel}>Votre conseiller</p>
                <p
                  className="mt-1"
                  style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#1C1917" }}
                >
                  {ADVISOR.name}
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "#A8A29E" }}
                >
                  {ADVISOR.title}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter sur WhatsApp"
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.529 5.855L0 24l6.293-1.501A11.964 11.964 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.213-3.727.889.924-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
              </a>
            </div>

            {/* Documents */}
            <div style={card} className="overflow-hidden">
              <div
                className="px-5 py-4 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid rgba(200,146,42,0.1)" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(200,146,42,0.12)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 600,
                      fontSize:   "0.9375rem",
                      color:      "#1C1917",
                    }}
                  >
                    Documents
                  </h2>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", color: "#A8A29E" }}>
                    Prêts sous 24h
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {DOC_TYPES.map(({ type, label, icon }) => (
                  <Link
                    key={type}
                    href={`/owner/dashboard/demandes/nouvelle?type=${type}`}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(200,146,42,0.05)] hover:border-[rgba(200,146,42,0.4)]"
                    style={{
                      border: "1.5px solid rgba(200,146,42,0.2)",
                      color:  "#3D3530",
                    }}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={1.75} opacity={0.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    <span className="flex-1">{label}</span>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#C8922A" strokeWidth={2} opacity={0.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
