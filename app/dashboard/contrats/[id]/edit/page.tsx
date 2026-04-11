import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateContractStatus } from "../../_actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditContratPage({ params }: Props) {
  const { id } = await params;
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: { property: { select: { title: true } } },
  });

  if (!contract) notFound();

  const boundAction = updateContractStatus.bind(null, id);

  return (
    <div className="p-8 max-w-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/contrats" className="hover:text-[#0066CC] transition-colors">
          Contrats
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/dashboard/contrats/${id}`} className="hover:text-[#0066CC] transition-colors truncate max-w-[150px]">
          {contract.property.title}
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Modifier le statut</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Modifier le statut</h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{contract.property.title}</p>
        </div>

        <form action={boundAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nouveau statut <span className="text-red-400">*</span>
            </label>
            <select name="status" required defaultValue={contract.status} className={inputClass}>
              <option value="PENDING">En attente</option>
              <option value="ACTIVE">Actif</option>
              <option value="TERMINATED">Résilié</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">
              Le statut du bien immobilier sera mis à jour automatiquement.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer
            </button>
            <Link
              href={`/dashboard/contrats/${id}`}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
