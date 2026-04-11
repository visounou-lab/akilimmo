import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const colorMap = {
  blue: {
    border: "border-[#0066CC]/20",
    bg: "bg-[#0066CC]/10",
    icon: "text-[#0066CC]",
  },
  green: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    icon: "text-orange-500",
  },
  purple: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    icon: "text-violet-600",
  },
} as const;

export default async function DashboardPage() {
  const session = await auth();

  const [propertyCount, activeContractCount, pendingPaymentCount, userCount] =
    await Promise.all([
      prisma.property.count(),
      prisma.contract.count({ where: { status: "ACTIVE" } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);

  const stats = [
    {
      label: "Biens immobiliers",
      value: propertyCount,
      color: "blue",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "Contrats actifs",
      value: activeContractCount,
      color: "green",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Paiements en attente",
      value: pendingPaymentCount,
      color: "orange",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      label: "Utilisateurs",
      value: userCount,
      color: "purple",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          Bonjour,{" "}
          <span className="font-medium text-[#0066CC]">{session?.user?.name}</span>{" "}
          — voici un aperçu de la plateforme.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const c = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl border ${c.border} p-6 flex items-start gap-4 shadow-sm`}
            >
              <div className={`${c.bg} ${c.icon} p-3 rounded-xl shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Accès rapide</h2>
          <p className="text-sm text-slate-400 mb-4">Gérer les ressources principales</p>
          <div className="space-y-1">
            {[
              { label: "Voir tous les biens", href: "/dashboard/properties", color: "text-[#0066CC]" },
              { label: "Gérer les contrats", href: "/dashboard/contracts", color: "text-emerald-600" },
              { label: "Suivre les paiements", href: "/dashboard/payments", color: "text-orange-500" },
              { label: "Gérer les utilisateurs", href: "/dashboard/users", color: "text-violet-600" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span className={`text-sm font-medium ${link.color}`}>{link.label}</span>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Récapitulatif</h2>
          <p className="text-sm text-slate-400 mb-4">État de la plateforme</p>
          <div className="space-y-3">
            {[
              {
                label: "Taux d'occupation",
                value:
                  propertyCount > 0
                    ? `${Math.round((activeContractCount / propertyCount) * 100)}%`
                    : "—",
                sub: `${activeContractCount} bien(s) loué(s) sur ${propertyCount}`,
              },
              {
                label: "Paiements en retard",
                value: pendingPaymentCount,
                sub: "en attente de traitement",
              },
              {
                label: "Membres inscrits",
                value: userCount,
                sub: "propriétaires + locataires",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{row.label}</p>
                  <p className="text-xs text-slate-400">{row.sub}</p>
                </div>
                <span className="text-lg font-bold text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
