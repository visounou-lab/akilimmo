import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ContratsSearch from "./_components/ContratsSearch";

export default async function ContratsPage() {
  const raw = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { title: true, city: true } },
      tenant:   { select: { name: true, email: true } },
      owner:    { select: { name: true } },
    },
  });
  const contracts = raw.map((c) => ({
    ...c,
    rentAmount: Number(c.rentAmount),
    startDate:  c.startDate.toISOString(),
    endDate:    c.endDate.toISOString(),
    createdAt:  c.createdAt.toISOString(),
  }));

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
        <ContratsSearch contracts={contracts} />
      )}
    </div>
  );
}
