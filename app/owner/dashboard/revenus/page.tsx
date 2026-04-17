import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const COMMISSION = 0.1;

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function RevenusPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string })?.id!;

  const contracts = await prisma.contract.findMany({
    where: { ownerId: userId },
    include: {
      property: { select: { title: true, city: true } },
      tenant:   { select: { name: true, email: true } },
      payments: {
        where:   { status: "PAID" },
        orderBy: { paidAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now           = new Date();
  const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);

  const allPaidPayments = contracts.flatMap((c) =>
    c.payments.map((p) => ({ ...p, property: c.property, tenant: c.tenant, contract: c }))
  );

  const totalCumul = allPaidPayments.reduce((s, p) => s + Number(p.amount), 0);
  const totalMois  = allPaidPayments
    .filter((p) => p.paidAt && p.paidAt >= startOfMonth)
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mes revenus</h1>
        <p className="text-sm text-slate-500 mt-0.5">Synthèse de vos paiements reçus</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Revenus du mois",  value: totalMois,  sub: "Mois en cours" },
          { label: "Revenus cumulés",  value: totalCumul, sub: "Tous les paiements" },
          { label: "Votre net (90%)",  value: totalCumul * (1 - COMMISSION), sub: "Après commission AKIL IMMO" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-slate-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-[#0066CC]">
              {formatPrice(Math.round(k.value))} <span className="text-sm font-normal text-slate-400">XOF</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tableau des réservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-slate-800">Détail des paiements</h2>
        </div>

        {allPaidPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Aucun paiement reçu pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/60">
                  {["Bien", "Client", "Payé le", "Montant brut", "Commission (10%)", "Net propriétaire"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allPaidPayments.map((p) => {
                  const montant    = Number(p.amount);
                  const commission = montant * COMMISSION;
                  const net        = montant - commission;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {p.property.title}
                        <span className="block text-xs text-slate-400 font-normal">{p.property.city}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {p.tenant.name ?? "—"}
                        <span className="block text-xs text-slate-400">{p.tenant.email}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        {p.paidAt ? formatDate(p.paidAt) : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {formatPrice(montant)} XOF
                      </td>
                      <td className="px-4 py-3.5 text-red-500 whitespace-nowrap">
                        − {formatPrice(Math.round(commission))} XOF
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#0066CC] whitespace-nowrap">
                        {formatPrice(Math.round(net))} XOF
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-100 bg-slate-50/40">
          <p className="text-xs text-slate-400">
            Les paiements sont versés chaque mois avant le 5. Commission AKIL IMMO : 10% par transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
