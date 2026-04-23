import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

const PROPERTY_STATUS: Record<string, { label: string; classes: string }> = {
  AVAILABLE:   { label: "Disponible",  classes: "bg-emerald-50 text-emerald-700" },
  RESERVED:    { label: "Réservé",     classes: "bg-[#0066CC]/10 text-[#0066CC]" },
  RENTED:      { label: "Loué",        classes: "bg-red-50 text-red-600" },
  OFF_MARKET:  { label: "Hors marché", classes: "bg-slate-100 text-slate-500" },
};

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
    propertyCount,
    activeContractCount,
    pendingPaymentCount,
    monthlyRevenue,
    overduePayments,
    recentPayments,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.contract.count({ where: { status: "ACTIVE" } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
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
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, city: true, status: true, price: true, imageUrl: true },
    }),
  ]);

  const revenue = Number(monthlyRevenue._sum.amount ?? 0);

  const stats = [
    {
      label: "Biens immobiliers",
      value: String(propertyCount),
      href:  "/dashboard/biens",
      color: "blue" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "Contrats actifs",
      value: String(activeContractCount),
      href:  "/dashboard/contrats",
      color: "green" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Loyers perçus ce mois",
      value: formatPrice(revenue),
      href:  "/dashboard/paiements?status=PAID",
      color: "orange" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Paiements en attente",
      value: String(pendingPaymentCount),
      href:  "/dashboard/paiements?status=PENDING",
      color: "red" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  const colorMap = {
    blue:   { border: "border-[#0066CC]/20",  bg: "bg-[#0066CC]/10",  icon: "text-[#0066CC]",    value: "text-[#0066CC]" },
    green:  { border: "border-emerald-200",    bg: "bg-emerald-50",    icon: "text-emerald-600",  value: "text-emerald-700" },
    orange: { border: "border-orange-200",     bg: "bg-orange-50",     icon: "text-orange-500",   value: "text-orange-600" },
    red:    { border: "border-red-200",        bg: "bg-red-50",        icon: "text-red-500",      value: "text-red-600" },
  } as const;

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          Bonjour,{" "}
          <span className="font-medium text-[#0066CC]">{session?.user?.name ?? "—"}</span>{" "}
          — voici un aperçu de la plateforme.
        </p>
      </div>

      {/* Loyers en retard */}
      {overduePayments.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">
                {overduePayments.length} loyer{overduePayments.length > 1 ? "s" : ""} en retard
              </p>
              <div className="mt-2 space-y-1.5">
                {overduePayments.map((p) => {
                  const daysLate = Math.floor((now.getTime() - p.dueDate.getTime()) / 86_400_000);
                  return (
                    <div key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-red-700">
                        <span className="font-medium">{p.contract.property.title}</span>
                        {" · "}{p.contract.tenant.name ?? p.contract.tenant.email}
                        {" · "}<span className="font-medium">{formatPrice(p.amount)}</span>
                        {" · "}
                        <span className="italic">{daysLate}j de retard</span>
                      </span>
                      <Link
                        href={`/dashboard/paiements?status=PENDING`}
                        className="text-xs font-medium text-red-700 underline hover:text-red-900"
                      >
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-10">
        {stats.map((stat) => {
          const c = colorMap[stat.color];
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`bg-white rounded-2xl border ${c.border} p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`${c.bg} ${c.icon} p-3 rounded-xl shrink-0`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold ${c.value} truncate`}>{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5 leading-snug">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

        {/* 5 derniers paiements */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Derniers paiements</h2>
            <Link
              href="/dashboard/paiements"
              className="text-xs text-[#0066CC] hover:underline font-medium"
            >
              Voir tout →
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun paiement enregistré.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => {
                const ps = PAYMENT_STATUS[p.status] ?? PAYMENT_STATUS.PENDING;
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {p.contract.property.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {p.contract.tenant.name ?? p.contract.tenant.email} · {formatDate(p.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                        {formatPrice(p.amount)}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ps.classes}`}>
                        {ps.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5 biens récents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Biens récents</h2>
            <Link
              href="/dashboard/biens"
              className="text-xs text-[#0066CC] hover:underline font-medium"
            >
              Voir tout →
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun bien enregistré.</p>
          ) : (
            <div className="space-y-3">
              {recentProperties.map((p) => {
                const ps = PROPERTY_STATUS[p.status] ?? PROPERTY_STATUS.OFF_MARKET;
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/biens/${p.id}/edit`}
                    className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    {/* Miniature */}
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                      <p className="text-xs text-slate-400">{p.city} · {formatPrice(p.price)}/nuit</p>
                    </div>

                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${ps.classes}`}>
                      {ps.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
