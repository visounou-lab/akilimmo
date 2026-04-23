import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING:    { label: "En attente", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  ACTIVE:     { label: "Actif",      classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  TERMINATED: { label: "Résilié",    classes: "bg-slate-100 text-slate-600 border border-slate-200" },
};

const PAYMENT_STATUS: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  PAID:    { label: "Payé",       classes: "bg-emerald-50 text-emerald-700" },
  FAILED:  { label: "Échoué",     classes: "bg-red-50 text-red-700" },
};

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContratDetailPage({ params }: Props) {
  const { id } = await params;

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      property: true,
      tenant:   { select: { name: true, email: true } },
      owner:    { select: { name: true, email: true } },
      payments: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!contract) notFound();

  const status = STATUS_CONFIG[contract.status] ?? STATUS_CONFIG.PENDING;

  // Durée en mois
  const nights = Math.max(1, Math.round(
    (contract.endDate.getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/contrats" className="hover:text-[#0066CC] transition-colors">
          Contrats
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Détails du contrat</span>
      </div>

      {/* En-tête */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{contract.property.title}</h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${status.classes}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Contrat créé le {formatDate(contract.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/contrats/${id}/pdf`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger PDF
          </Link>
          <Link
            href={`/dashboard/contrats/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier le statut
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos contrat */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Conditions du contrat</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Date de début</p>
                <p className="text-sm font-medium text-slate-800">{formatDate(contract.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Date de fin</p>
                <p className="text-sm font-medium text-slate-800">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Durée</p>
                <p className="text-sm font-medium text-slate-800">{nights} nuit{nights > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Prix par nuit</p>
                <p className="text-sm font-semibold text-[#0066CC]">{formatPrice(contract.rentAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Total séjour</p>
                <p className="text-sm font-semibold text-slate-800">{formatPrice(Number(contract.rentAmount) * nights)}</p>
              </div>
            </div>
          </div>

          {/* Bien */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Bien immobilier</h2>
            <div className="flex items-start gap-4">
              {contract.property.imageUrl && (
                <img
                  src={contract.property.imageUrl}
                  alt={contract.property.title}
                  className="w-20 h-16 rounded-lg object-cover shrink-0"
                />
              )}
              <div>
                <p className="font-medium text-slate-800">{contract.property.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{contract.property.address}</p>
                <p className="text-sm text-slate-500">{contract.property.city}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span>{contract.property.bedrooms} chambres</span>
                  <span>·</span>
                  <span>{contract.property.bathrooms} sdb</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paiements */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
              Paiements ({contract.payments.length})
            </h2>
            {contract.payments.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun paiement enregistré.</p>
            ) : (
              <div className="space-y-2">
                {contract.payments.map((p) => {
                  const ps = PAYMENT_STATUS[p.status] ?? PAYMENT_STATUS.PENDING;
                  return (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm text-slate-700">Échéance : {formatDate(p.dueDate)}</p>
                        {p.paidAt && (
                          <p className="text-xs text-slate-400">Payé le {formatDate(p.paidAt)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-800">{formatPrice(p.amount)}</span>
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
        </div>

        {/* Sidebar infos */}
        <div className="space-y-6">
          {/* Locataire */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Locataire</h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-[#0066CC]">
                  {(contract.tenant.name ?? contract.tenant.email)[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{contract.tenant.name ?? "—"}</p>
                <p className="text-xs text-slate-400 truncate">{contract.tenant.email}</p>
              </div>
            </div>
          </div>

          {/* Propriétaire */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Propriétaire</h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-slate-500">
                  {(contract.owner.name ?? contract.owner.email)[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{contract.owner.name ?? "—"}</p>
                <p className="text-xs text-slate-400 truncate">{contract.owner.email}</p>
              </div>
            </div>
          </div>

          {/* Statut rapide */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Statut actuel</h2>
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${status.classes}`}>
              {status.label}
            </span>
            <div className="mt-4">
              <Link
                href={`/dashboard/contrats/${id}/edit`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Changer le statut
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
