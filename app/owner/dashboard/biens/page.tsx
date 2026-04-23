import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PUBLISH_STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  draft:          { label: "Brouillon",   bg: "bg-slate-100",    text: "text-slate-500",    dot: "bg-slate-400"   },
  pending_review: { label: "En révision", bg: "bg-amber-50",     text: "text-amber-600",    dot: "bg-amber-400"   },
  published:      { label: "Publié",      bg: "bg-emerald-50",   text: "text-emerald-700",  dot: "bg-emerald-500" },
  rejected:       { label: "Refusé",      bg: "bg-red-50",       text: "text-red-600",      dot: "bg-red-500"     },
};

const RENTAL_STATUS: Record<string, { label: string; color: string }> = {
  AVAILABLE:  { label: "Disponible",  color: "#0066CC" },
  RENTED:     { label: "Loué",        color: "#16A34A" },
  RESERVED:   { label: "Réservé",     color: "#D97706" },
  OFF_MARKET: { label: "Hors marché", color: "#64748B" },
};

function formatPrice(n: number | string | { toNumber(): number }) {
  return new Intl.NumberFormat("fr-FR").format(
    typeof n === "object" ? n.toNumber() : Number(n)
  );
}

export default async function OwnerBiensPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id!;

  const biens = await prisma.property.findMany({
    where:   { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id:            true,
      slug:          true,
      title:         true,
      city:          true,
      country:       true,
      price:         true,
      status:        true,
      publishStatus: true,
      adminNote:     true,
      createdAt:     true,
      images: {
        orderBy: { order: "asc" },
        take: 1,
        select: { url: true },
      },
      contracts: {
        where: { status: "ACTIVE" },
        select: { id: true },
      },
    },
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes biens</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {biens.length} bien{biens.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/owner/dashboard/soumettre"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Soumettre un bien
        </Link>
      </div>

      {biens.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Aucun bien pour l&apos;instant.</p>
          <p className="text-sm text-slate-400 mt-1">Soumettez votre premier bien à la location.</p>
          <Link
            href="/owner/dashboard/soumettre"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition"
          >
            Soumettre un bien
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {biens.map((b) => {
            const pubSt     = PUBLISH_STATUS[b.publishStatus] ?? PUBLISH_STATUS.draft;
            const rentSt    = RENTAL_STATUS[b.status] ?? RENTAL_STATUS.AVAILABLE;
            const thumb     = b.images[0]?.url;
            const hasLease  = b.contracts.length > 0;

            return (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-40 bg-slate-100 shrink-0">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Rental status pill */}
                  <div className="absolute top-2 left-2">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: rentSt.color }}
                    >
                      {rentSt.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{b.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.city}, {b.country}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-slate-900">{formatPrice(b.price)} XOF</span>
                    <span className="text-xs text-slate-400">/ nuit</span>
                  </div>

                  {/* Publication status */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${pubSt.bg} ${pubSt.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pubSt.dot}`} />
                      {pubSt.label}
                    </span>
                    {b.publishStatus === "rejected" && b.adminNote && (
                      <p className="mt-1 text-xs text-red-500 leading-snug">{b.adminNote}</p>
                    )}
                  </div>

                  {/* Active lease indicator */}
                  {hasLease && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Contrat actif
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    {b.publishStatus === "published" && b.slug && (
                      <Link
                        href={`/biens/${b.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-[#0066CC] hover:underline"
                      >
                        Voir la fiche →
                      </Link>
                    )}
                    <Link
                      href={`/owner/dashboard/demandes/nouvelle?type=quittance&propertyId=${b.id}`}
                      className="ml-auto text-xs text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Demander un doc
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
