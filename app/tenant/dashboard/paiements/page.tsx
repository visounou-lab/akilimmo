import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "En attente", classes: "bg-amber-50 text-amber-700"   },
  PAID:    { label: "Payé",       classes: "bg-emerald-50 text-emerald-700" },
  FAILED:  { label: "Échoué",     classes: "bg-red-50 text-red-700"        },
};

const METHOD_LABELS: Record<string, string> = {
  wave: "Wave", orange_money: "Orange Money", free_money: "Free Money",
  virement: "Virement", especes: "Espèces", autre: "Autre",
};

const TABS = [
  { key: "",        label: "Tous"       },
  { key: "PENDING", label: "En attente" },
  { key: "PAID",    label: "Payés"      },
];

function formatPrice(n: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(n)) + " FCFA";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function TenantPaiementsPage({ searchParams }: Props) {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const { status: filterStatus } = await searchParams;

  const where = {
    payerId: userId,
    ...(filterStatus ? { status: filterStatus as "PENDING" | "PAID" | "FAILED" } : {}),
  };

  const [payments, allPayments] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: {
        contract: {
          include: { property: { select: { title: true, city: true } } },
        },
      },
    }),
    prisma.payment.findMany({
      where:  { payerId: userId },
      select: { amount: true, status: true },
    }),
  ]);

  const totalPaid    = allPayments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = allPayments.filter((p) => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes paiements</h1>
        <p className="text-sm text-slate-500 mt-0.5">Historique de vos loyers</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total payé</p>
          <p className="text-xl font-bold text-emerald-600">{formatPrice(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">En attente</p>
          <p className="text-xl font-bold text-amber-600">{formatPrice(totalPending)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const active = (filterStatus ?? "") === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/tenant/dashboard/paiements?status=${tab.key}` : "/tenant/dashboard/paiements"}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <p className="text-slate-500 font-medium">
            {filterStatus ? "Aucun paiement pour ce filtre" : "Aucun paiement enregistré"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Échéance</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p) => {
                  const st = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 truncate max-w-[160px]">{p.contract.property.title}</p>
                        <p className="text-xs text-slate-400">{p.contract.property.city}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{formatDate(p.dueDate)}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{formatPrice(p.amount)}</td>
                      <td className="px-4 py-3.5">
                        {p.paymentMethod ? (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            {METHOD_LABELS[p.paymentMethod] ?? p.paymentMethod}
                          </span>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {p.paidAt ? formatDate(p.paidAt) : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {payments.map((p) => {
              const st = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{p.contract.property.title}</p>
                      <p className="text-xs text-slate-400">{p.contract.property.city}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${st.classes}`}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{formatPrice(p.amount)}</span>
                    <span className="text-xs text-slate-400">{formatDate(p.dueDate)}</span>
                  </div>
                  {p.paymentMethod && (
                    <span className="mt-2 inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {METHOD_LABELS[p.paymentMethod] ?? p.paymentMethod}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
