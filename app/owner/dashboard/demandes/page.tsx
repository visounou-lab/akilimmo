import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  quittance:   "Quittance de loyer",
  contrat:     "Contrat de location",
  attestation: "Attestation de propriété",
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "En attente",  bg: "bg-amber-50",  text: "text-amber-700" },
  processing: { label: "En cours",   bg: "bg-blue-50",   text: "text-blue-700"  },
  delivered:  { label: "Transmis",   bg: "bg-green-50",  text: "text-green-700" },
};

export default async function DemandesPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const requests = await prisma.documentRequest.findMany({
    where:   { ownerId: userId },
    include: { property: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes demandes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Documents demandés auprès de votre conseiller</p>
        </div>
        <Link
          href="/owner/dashboard/demandes/nouvelle"
          className="inline-flex items-center gap-2 rounded-full bg-[#0066CC] text-white px-4 py-2 text-sm font-semibold hover:bg-[#004499] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle demande
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Aucune demande pour l&apos;instant.</p>
          <Link
            href="/owner/dashboard/demandes/nouvelle"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#0066CC] hover:underline"
          >
            Faire une première demande
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const status = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
            const typeLabel = TYPE_LABELS[r.type] ?? r.type;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0066CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900">{typeLabel}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  {r.property && (
                    <p className="text-xs text-slate-500 mt-0.5">{r.property.title}</p>
                  )}
                  {r.message && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.message}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    {r.deliveredAt && (
                      <span className="ml-2 text-green-600">
                        · Transmis le {new Date(r.deliveredAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
