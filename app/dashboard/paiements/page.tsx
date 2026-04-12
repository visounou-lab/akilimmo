import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MarkAsPaidButton from "./_components/MarkAsPaidButton";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  PAID:    { label: "Payé",       classes: "bg-emerald-50 text-emerald-700" },
  FAILED:  { label: "Échoué",     classes: "bg-red-50 text-red-700" },
};

const TABS = [
  { key: "",        label: "Tous" },
  { key: "PENDING", label: "En attente" },
  { key: "PAID",    label: "Payés" },
  { key: "FAILED",  label: "Échoués" },
];

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function PaiementsPage({ searchParams }: Props) {
  const { status: filterStatus } = await searchParams;

  const where = filterStatus
    ? { status: filterStatus as "PENDING" | "PAID" | "FAILED" }
    : {};

  const [payments, allPayments] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: {
        contract: {
          include: {
            property: { select: { title: true, city: true } },
            tenant:   { select: { name: true, email: true } },
          },
        },
      },
    }),
    prisma.payment.findMany({ select: { amount: true, status: true } }),
  ]);

  const totalAll   = allPayments.reduce((s, p) => s + Number(p.amount), 0);
  const paidAll    = allPayments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount), 0);
  const pendingAll = allPayments.filter((p) => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {payments.length} paiement{payments.length !== 1 ? "s" : ""}
            {filterStatus ? ` · ${STATUS_CONFIG[filterStatus]?.label ?? filterStatus}` : ""}
          </p>
        </div>
        <Link
          href="/dashboard/paiements/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Enregistrer un paiement
        </Link>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",      value: formatPrice(totalAll),   color: "text-slate-800" },
          { label: "Encaissé",   value: formatPrice(paidAll),    color: "text-emerald-600" },
          { label: "En attente", value: formatPrice(pendingAll), color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs filtre */}
      <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const active = (filterStatus ?? "") === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/dashboard/paiements?status=${tab.key}` : "/dashboard/paiements"}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <p className="text-slate-500 font-medium">
            {filterStatus ? "Aucun paiement pour ce filtre" : "Aucun paiement enregistré"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {filterStatus
              ? "Essayez un autre filtre ou enregistrez un paiement."
              : "Commencez par enregistrer un paiement."}
          </p>
          {!filterStatus && (
            <Link
              href="/dashboard/paiements/new"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors"
            >
              Enregistrer un paiement
            </Link>
          )}
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
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => {
                const st = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 truncate max-w-[160px]">
                        {p.contract.property.title}
                      </p>
                      <p className="text-xs text-slate-400">{p.contract.property.city}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{p.contract.tenant.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[140px]">
                        {p.contract.tenant.email}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(p.dueDate)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(p.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 hidden md:table-cell">
                      {p.paidAt ? formatDate(p.paidAt) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {p.status === "PENDING" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MarkAsPaidButton id={p.id} />
                        </div>
                      )}
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
