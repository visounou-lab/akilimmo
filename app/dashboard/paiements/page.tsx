import { prisma } from "@/lib/prisma";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  PAID:    { label: "Payé",       classes: "bg-emerald-50 text-emerald-700" },
  FAILED:  { label: "Échoué",     classes: "bg-red-50 text-red-700" },
};

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function PaiementsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { dueDate: "desc" },
    include: {
      contract: {
        include: {
          property: { select: { title: true, city: true } },
        },
      },
      payer: { select: { name: true, email: true } },
    },
  });

  const total    = payments.reduce((s, p) => s + Number(p.amount), 0);
  const paid     = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount), 0);
  const pending  = payments.filter((p) => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
        <p className="text-sm text-slate-500 mt-0.5">{payments.length} paiement{payments.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: formatPrice(total), color: "text-slate-800" },
          { label: "Encaissé", value: formatPrice(paid), color: "text-emerald-600" },
          { label: "En attente", value: formatPrice(pending), color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <p className="text-slate-500 font-medium">Aucun paiement enregistré</p>
          <p className="text-sm text-slate-400 mt-1">Les paiements apparaissent ici dès qu&apos;un contrat est créé.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Locataire</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Échéance</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Payé le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => {
                const status = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 truncate max-w-[160px]">{p.contract.property.title}</p>
                      <p className="text-xs text-slate-400">{p.contract.property.city}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{p.payer.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[140px]">{p.payer.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{formatDate(p.dueDate)}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{formatPrice(p.amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 hidden md:table-cell">
                      {p.paidAt ? formatDate(p.paidAt) : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
