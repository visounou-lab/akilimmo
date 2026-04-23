import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

const PAYMENT_STATUS: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  PAID:    { label: "Payé",       classes: "bg-emerald-50 text-emerald-700" },
  FAILED:  { label: "Échoué",     classes: "bg-red-50 text-red-700" },
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
      label: "Biens publiés",
      value: String(publishedPropertyCount),
      sub:   pendingPropertyCount > 0 ? `${pendingPropertyCount} en attente` : "Tous validés",
      subAlert: pendingPropertyCount > 0,
      href:  "/dashboard/biens",
      color: "blue" as const,
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      label: "Propriétaires actifs",
      value: String(activeOwnerCount),
      sub:   pendingOwnerCount > 0 ? `${pendingOwnerCount} en attente d'activation` : "Aucun en attente",
      subAlert: pendingOwnerCount > 0,
      href:  "/dashboard/proprietaires",
      color: "purple" as const,
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label: "Contrats actifs",
      value: String(activeContractCount),
      sub:   "Locations en cours",
      subAlert: false,
      href:  "/dashboard/contrats",
      color: "green" as const,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      label: "Revenus ce mois",
      value: formatPrice(revenue),
      sub:   `Commission : ${new Intl.NumberFormat("fr-FR").format(Math.round(revenue * 0.06))} XOF`,
      subAlert: false,
      href:  "/dashboard/paiements?status=PAID",
      color: "orange" as const,
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const colorMap = {
    blue:   { border: "border-[#0066CC]/20", bg: "bg-[#0066CC]/10", icon: "text-[#0066CC]",    value: "text-[#0066CC]" },
    purple: { border: "border-purple-200",   bg: "bg-purple-50",    icon: "text-purple-600",   value: "text-purple-700" },
    green:  { border: "border-emerald-200",  bg: "bg-emerald-50",   icon: "text-emerald-600",  value: "text-emerald-700" },
    orange: { border: "border-orange-200",   bg: "bg-orange-50",    icon: "text-orange-500",   value: "text-orange-600" },
  } as const;

  const STATUS_OWNER: Record<string, { label: string; classes: string }> = {
    active:    { label: "Actif",    classes: "bg-emerald-50 text-emerald-700" },
    pending:   { label: "En attente", classes: "bg-amber-50 text-amber-700" },
    suspended: { label: "Suspendu", classes: "bg-red-50 text-red-700" },
  };

  const shortcuts = [
    { href: "/dashboard/valider",       label: "Valider des biens",        badge: pendingPropertyCount || undefined, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/dashboard/proprietaires", label: "Activer un propriétaire",  badge: pendingOwnerCount || undefined,    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
    { href: "/dashboard/contrats/new",  label: "Créer un contrat",         badge: undefined,                         icon: "M12 4v16m8-8H4" },
    { href: "/dashboard/messages",      label: "Envoyer un message",       badge: undefined,                         icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Bonjour, <span className="font-medium text-[#0066CC]">{session?.user?.name ?? "Admin"}</span> — aperçu de la plateforme
        </p>
      </div>

      {/* Loyers en retard */}
      {overduePayments.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 mb-2">
                {overduePayments.length} loyer{overduePayments.length > 1 ? "s" : ""} en retard
              </p>
              <div className="space-y-1.5">
                {overduePayments.map((p) => {
                  const daysLate = Math.floor((now.getTime() - p.dueDate.getTime()) / 86_400_000);
                  return (
                    <div key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-red-700">
                        <span className="font-medium">{p.contract.property.title}</span>
                        {" · "}{p.contract.tenant.name ?? p.contract.tenant.email}
                        {" · "}<span className="font-medium">{formatPrice(p.amount)}</span>
                        {" · "}<span className="italic">{daysLate}j de retard</span>
                      </span>
                      <Link href="/dashboard/paiements?status=PENDING" className="text-xs font-medium text-red-700 underline hover:text-red-900">
                        Voir →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => {
          const c = colorMap[kpi.color];
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className={`bg-white rounded-2xl border ${c.border} p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`${c.bg} ${c.icon} p-3 rounded-xl shrink-0`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold ${c.value} truncate`}>{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{kpi.label}</p>
                <p className={`text-xs mt-1 font-medium ${kpi.subAlert ? "text-amber-600" : "text-slate-400"}`}>
                  {kpi.sub}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cumul total + raccourcis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Cumul total */}
        <div className="bg-gradient-to-br from-[#0066CC] to-[#004499] rounded-2xl p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">Revenus cumulés</p>
          <p className="text-3xl font-bold mb-1">{formatPrice(revenueTotal)}</p>
          <p className="text-sm text-blue-200">dont <span className="font-semibold text-white">{formatPrice(akilFee)}</span> de commission AKIL IMMO</p>
          <Link href="/dashboard/paiements" className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-blue-200 hover:text-white transition-colors">
            Voir tous les paiements →
          </Link>
        </div>

        {/* Raccourcis */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#0066CC]/30 hover:bg-[#0066CC]/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0066CC]/10 flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-[#0066CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700 flex-1">{s.label}</span>
                {s.badge ? (
                  <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Derniers paiements</h2>
            <Link href="/dashboard/paiements" className="text-xs text-[#0066CC] hover:underline font-medium">Voir tout →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun paiement enregistré.</p>
          ) : (
            <div className="space-y-0">
              {recentPayments.map((p) => {
                const ps = PAYMENT_STATUS[p.status] ?? PAYMENT_STATUS.PENDING;
                return (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.contract.property.title}</p>
                      <p className="text-xs text-slate-400 truncate">{p.contract.tenant.name ?? p.contract.tenant.email} · {formatDate(p.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{formatPrice(p.amount)}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ps.classes}`}>{ps.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Propriétaires récents */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Propriétaires récents</h2>
            <Link href="/dashboard/proprietaires" className="text-xs text-[#0066CC] hover:underline font-medium">Voir tout →</Link>
          </div>
          {recentOwners.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun propriétaire inscrit.</p>
          ) : (
            <div className="space-y-0">
              {recentOwners.map((o) => {
                const st = STATUS_OWNER[o.status] ?? STATUS_OWNER.pending;
                return (
                  <div key={o.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-[#0066CC]">
                        {(o.name ?? o.email)[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{o.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 truncate">{o.city ?? o.email}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${st.classes}`}>
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
