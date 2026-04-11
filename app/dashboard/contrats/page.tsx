import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteContractButton from "./_components/DeleteContractButton";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING:    { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  ACTIVE:     { label: "Actif",      classes: "bg-emerald-50 text-emerald-700" },
  TERMINATED: { label: "Résilié",    classes: "bg-slate-100 text-slate-600" },
};

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function ContratsPage() {
  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, city: true } },
      tenant:   { select: { name: true, email: true } },
      owner:    { select: { name: true } },
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contrats</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {contracts.length} contrat{contracts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/contrats/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau contrat
        </Link>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">Aucun contrat enregistré</p>
          <p className="text-sm text-slate-400 mt-1">Commencez par créer votre premier contrat.</p>
          <Link
            href="/dashboard/contrats/new"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors"
          >
            Créer un contrat
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Locataire</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Période</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loyer</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contracts.map((c) => {
                const status = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Bien */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 truncate max-w-[180px]">{c.property.title}</p>
                      <p className="text-xs text-slate-400">{c.property.city}</p>
                    </td>

                    {/* Locataire */}
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{c.tenant.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{c.tenant.email}</p>
                    </td>

                    {/* Période */}
                    <td className="px-4 py-3.5 text-slate-600 text-xs hidden md:table-cell whitespace-nowrap">
                      <span>{formatDate(c.startDate)}</span>
                      <span className="mx-1 text-slate-300">→</span>
                      <span>{formatDate(c.endDate)}</span>
                    </td>

                    {/* Loyer */}
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(c.rentAmount)}
                    </td>

                    {/* Statut */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/contrats/${c.id}`}
                          title="Voir les détails"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-[#0066CC]/10 hover:text-[#0066CC] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/dashboard/contrats/${c.id}/edit`}
                          title="Modifier le statut"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-[#0066CC]/10 hover:text-[#0066CC] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <DeleteContractButton id={c.id} />
                      </div>
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
