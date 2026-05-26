import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

const PAYMENT_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: "En attente", bg: "#FEF3C7", text: "#92400E" },
  PAID:    { label: "Payé",       bg: "#D1FAE5", text: "#065F46" },
  FAILED:  { label: "Échoué",     bg: "#FEE2E2", text: "#991B1B" },
};

const STATUS_OWNER: Record<string, { label: string; bg: string; text: string }> = {
  active:    { label: "Actif",      bg: "#D1FAE5", text: "#065F46" },
  pending:   { label: "En attente", bg: "#FEF3C7", text: "#92400E" },
  suspended: { label: "Suspendu",   bg: "#FEE2E2", text: "#991B1B" },
};

const sectionTitle: React.CSSProperties = {
  fontSize: "0.625rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#C8922A",
  marginBottom: "1rem",
};

const card: React.CSSProperties = {
  backgroundColor: "#FDFCF8",
  border: "1.5px solid rgba(200,146,42,0.2)",
  borderRadius: 16,
  padding: "1.5rem",
  boxShadow: "0 2px 8px rgba(28,25,23,0.05)",
};

export default async function DashboardPage() {
  const session = await auth();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    publishedPropertyCount,
    pendingPropertyCount,
    activeContractCount,
    activeOwnerCount,
    pendingOwnerCount,
    pendingReservations,
    monthlyRevenue,
    totalRevenue,
    overduePayments,
    recentPayments,
    recentOwners,
  ] = await Promise.all([
    prisma.property.count({ where: { publishStatus: "published" } }),
    prisma.property.count({ where: { publishStatus: "pending_review" } }),
    prisma.contract.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "OWNER", status: "active" } }),
    prisma.user.count({ where: { role: "OWNER", status: "pending" } }),
    prisma.reservationRequest.count({ where: { status: "pending" } }).catch(() => 0),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.payment.findMany({
      where: { status: "PENDING", dueDate: { lt: now } },
      orderBy: { dueDate: "asc" },
      include: {
        contract: {
          include: {
            property: { select: { title: true } },
            tenant:   { select: { name: true, email: true } },
          },
        },
      },
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        contract: {
          include: {
            property: { select: { title: true } },
            tenant:   { select: { name: true, email: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where:   { role: "OWNER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, status: true, createdAt: true, country: true, city: true },
    }),
  ]);

  const revenue      = Number(monthlyRevenue._sum.amount ?? 0);
  const revenueTotal = Number(totalRevenue._sum.amount ?? 0);
  const akilFee      = Math.round(revenueTotal * 0.06);

  const kpis = [
    {
      label:    "Biens publiés",
      value:    publishedPropertyCount,
      sub:      pendingPropertyCount > 0 ? `${pendingPropertyCount} en attente` : "Tous validés",
      alert:    pendingPropertyCount > 0,
      href:     "/dashboard/biens",
      iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      label:    "Propriétaires actifs",
      value:    activeOwnerCount,
      sub:      pendingOwnerCount > 0 ? `${pendingOwnerCount} en attente` : "Aucun en attente",
      alert:    pendingOwnerCount > 0,
      href:     "/dashboard/proprietaires",
      iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label:    "Contrats actifs",
      value:    activeContractCount,
      sub:      "Locations en cours",
      alert:    false,
      href:     "/dashboard/contrats",
      iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      label:    "Réservations en attente",
      value:    pendingReservations,
      sub:      pendingReservations > 0 ? "À traiter" : "Aucune en attente",
      alert:    pendingReservations > 0,
      href:     "/dashboard/reservations",
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
  ];

  const shortcuts = [
    { href: "/dashboard/valider",       label: "Valider des biens",       badge: pendingPropertyCount || undefined, iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/dashboard/proprietaires", label: "Activer un propriétaire", badge: pendingOwnerCount || undefined,    iconPath: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
    { href: "/dashboard/reservations",  label: "Gérer les réservations",  badge: pendingReservations || undefined,  iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { href: "/dashboard/contrats/new",  label: "Créer un contrat",        badge: undefined,                         iconPath: "M12 4v16m8-8H4" },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p style={{ ...sectionTitle, marginBottom: 4 }}>ADMINISTRATION</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            color: "#1C1917",
            letterSpacing: "-0.01em",
          }}
        >
          Tableau de bord
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B5E52", marginTop: 4 }}>
          Bonjour,{" "}
          <span style={{ color: "#C8922A", fontWeight: 600 }}>
            {session?.user?.name ?? "Admin"}
          </span>{" "}
          — aperçu de la plateforme
        </p>
      </div>

      {/* Alerte loyers en retard */}
      {overduePayments.length > 0 && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: "#FEF2F2", border: "1.5px solid rgba(239,68,68,0.25)" }}
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#EF4444" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-2" style={{ color: "#991B1B" }}>
              {overduePayments.length} loyer{overduePayments.length > 1 ? "s" : ""} en retard
            </p>
            <div className="space-y-1.5">
              {overduePayments.map((p) => {
                const daysLate = Math.floor((now.getTime() - p.dueDate.getTime()) / 86_400_000);
                return (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm" style={{ color: "#B91C1C" }}>
                      <span className="font-medium">{p.contract.property.title}</span>
                      {" · "}{p.contract.tenant.name ?? p.contract.tenant.email}
                      {" · "}<span className="font-medium">{formatPrice(p.amount)}</span>
                      {" · "}<span className="italic">{daysLate}j de retard</span>
                    </span>
                    <Link href="/dashboard/paiements?status=PENDING" className="text-xs font-medium underline" style={{ color: "#991B1B" }}>
                      Voir →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="block group">
            <div
              className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 group-hover:shadow-md"
              style={{
                backgroundColor: "#FDFCF8",
                border: "1.5px solid rgba(200,146,42,0.2)",
                boxShadow: "0 2px 8px rgba(28,25,23,0.04)",
              }}
            >
              <div
                className="p-3 rounded-xl shrink-0"
                style={{ backgroundColor: "rgba(200,146,42,0.1)", border: "1px solid rgba(200,146,42,0.2)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={{ color: "#C8922A" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={kpi.iconPath} />
                </svg>
              </div>
              <div className="min-w-0">
                <p
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    color: "#1C1917",
                    lineHeight: 1,
                  }}
                >
                  {kpi.value}
                </p>
                <p className="text-xs mt-1 leading-snug" style={{ color: "#6B5E52" }}>{kpi.label}</p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: kpi.alert ? "#D97706" : "rgba(107,94,82,0.6)" }}
                >
                  {kpi.sub}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenus + Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Carte revenus */}
        <div
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #1C1917 0%, #2D2420 100%)",
            border: "1.5px solid rgba(200,146,42,0.25)",
            boxShadow: "0 4px 20px rgba(28,25,23,0.15)",
          }}
        >
          <div>
            <p style={{ ...sectionTitle, color: "rgba(200,146,42,0.7)", marginBottom: 12 }}>
              REVENUS CE MOIS
            </p>
            <p
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "#FDFCF8",
                lineHeight: 1.1,
              }}
            >
              {formatPrice(revenue)}
            </p>
            <p className="text-sm mt-2" style={{ color: "rgba(253,252,248,0.55)" }}>
              Commission:{" "}
              <span style={{ color: "#C8922A", fontWeight: 600 }}>
                {new Intl.NumberFormat("fr-FR").format(Math.round(revenue * 0.06))} XOF
              </span>
            </p>
          </div>
          <div style={{ borderTop: "1px solid rgba(200,146,42,0.15)", paddingTop: "1rem", marginTop: "1.25rem" }}>
            <p className="text-xs mb-0.5" style={{ color: "rgba(253,252,248,0.4)" }}>Cumul total encaissé</p>
            <p
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#C8922A",
              }}
            >
              {formatPrice(revenueTotal)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(253,252,248,0.4)" }}>
              dont{" "}
              <span style={{ color: "rgba(200,146,42,0.8)" }}>
                {formatPrice(akilFee)}
              </span>{" "}
              AKIL IMMO (6%)
            </p>
            <Link
              href="/dashboard/paiements"
              className="inline-flex items-center gap-1 mt-3 text-xs font-medium transition-colors"
              style={{ color: "rgba(200,146,42,0.7)" }}
            >
              Voir tous les paiements →
            </Link>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="lg:col-span-2" style={card}>
          <p style={sectionTitle}>ACTIONS RAPIDES</p>
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group"
                style={{ border: "1.5px solid rgba(200,146,42,0.15)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200,146,42,0.4)";
                  e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200,146,42,0.15)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: "rgba(200,146,42,0.1)" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={{ color: "#C8922A" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.iconPath} />
                  </svg>
                </div>
                <span className="text-sm font-medium flex-1" style={{ color: "#3D3530" }}>{s.label}</span>
                {s.badge ? (
                  <span
                    className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "#EF4444", color: "#fff" }}
                  >
                    {s.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Derniers paiements */}
        <div style={card}>
          <div className="flex items-center justify-between" style={{ marginBottom: "1rem" }}>
            <p style={sectionTitle}>DERNIERS PAIEMENTS</p>
            <Link href="/dashboard/paiements" className="text-xs font-medium transition-colors" style={{ color: "#C8922A" }}>
              Voir tout →
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm" style={{ color: "rgba(107,94,82,0.6)" }}>Aucun paiement enregistré.</p>
          ) : (
            <div>
              {recentPayments.map((p) => {
                const ps = PAYMENT_STATUS[p.status] ?? PAYMENT_STATUS.PENDING;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: "1px solid rgba(200,146,42,0.1)" }}
                  >
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium truncate" style={{ color: "#1C1917" }}>{p.contract.property.title}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "rgba(107,94,82,0.7)" }}>
                        {p.contract.tenant.name ?? p.contract.tenant.email} · {formatDate(p.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#1C1917" }}>
                        {formatPrice(p.amount)}
                      </span>
                      <span
                        className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: ps.bg, color: ps.text }}
                      >
                        {ps.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Propriétaires récents */}
        <div style={card}>
          <div className="flex items-center justify-between" style={{ marginBottom: "1rem" }}>
            <p style={sectionTitle}>PROPRIÉTAIRES RÉCENTS</p>
            <Link href="/dashboard/proprietaires" className="text-xs font-medium transition-colors" style={{ color: "#C8922A" }}>
              Voir tout →
            </Link>
          </div>
          {recentOwners.length === 0 ? (
            <p className="text-sm" style={{ color: "rgba(107,94,82,0.6)" }}>Aucun propriétaire inscrit.</p>
          ) : (
            <div>
              {recentOwners.map((o) => {
                const st = STATUS_OWNER[o.status] ?? STATUS_OWNER.pending;
                return (
                  <div
                    key={o.id}
                    className="flex items-center gap-3 py-3"
                    style={{ borderBottom: "1px solid rgba(200,146,42,0.1)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(200,146,42,0.12)", border: "1px solid rgba(200,146,42,0.25)" }}
                    >
                      <span className="text-xs font-semibold" style={{ color: "#C8922A" }}>
                        {(o.name ?? o.email)[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" style={{ color: "#1C1917" }}>{o.name ?? "—"}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "rgba(107,94,82,0.6)" }}>
                        {o.city ?? o.email}
                      </p>
                    </div>
                    <span
                      className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                      style={{ backgroundColor: st.bg, color: st.text }}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
