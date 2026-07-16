import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PUBLISH_STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  draft:          { label: "Brouillon",   bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
  pending_review: { label: "En révision", bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
  published:      { label: "Publié",      bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected:       { label: "Refusé",      bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
};

const SALE_STATUS: Record<string, { label: string; color: string }> = {
  AVAILABLE:  { label: "En vente",    color: "#C8922A" },
  RESERVED:   { label: "Réservé",     color: "#D97706" },
  SOLD:       { label: "Vendu",       color: "#16A34A" },
  OFF_MARKET: { label: "Hors marché", color: "#64748B" },
};

function formatPrice(n: number | string | { toString(): string }) {
  return new Intl.NumberFormat("fr-FR").format(Number(n));
}

export default async function OwnerTerrainsPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id!;

  const terrains = await prisma.land.findMany({
    where:   { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id:            true,
      slug:          true,
      title:         true,
      city:          true,
      country:       true,
      price:         true,
      surface:       true,
      status:        true,
      publishStatus: true,
      adminNote:     true,
      imageUrl:      true,
      images:        true,
    },
  });

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes terrains</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {terrains.length} terrain{terrains.length !== 1 ? "s" : ""} en vente
          </p>
        </div>
        <Link
          href="/owner/dashboard/terrains/soumettre"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2D2420] text-white text-sm font-semibold transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Mettre un terrain en vente
        </Link>
      </div>

      {terrains.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Aucun terrain pour l&apos;instant.</p>
          <p className="text-sm text-slate-400 mt-1">Mettez votre premier terrain en vente.</p>
          <Link
            href="/owner/dashboard/terrains/soumettre"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2D2420] text-white text-sm font-semibold transition"
          >
            Mettre un terrain en vente
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {terrains.map((t) => {
            const pubSt   = PUBLISH_STATUS[t.publishStatus] ?? PUBLISH_STATUS.draft;
            const saleSt  = SALE_STATUS[t.status] ?? SALE_STATUS.AVAILABLE;
            const thumb   = t.images[0] ?? t.imageUrl ?? null;

            return (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-40 bg-slate-100 shrink-0">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={t.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: saleSt.color }}
                    >
                      {saleSt.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{t.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.city}, {t.country} · {t.surface} m²</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-slate-900">{formatPrice(t.price)} XOF</span>
                  </div>

                  {/* Publication status */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${pubSt.bg} ${pubSt.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pubSt.dot}`} />
                      {pubSt.label}
                    </span>
                    {t.publishStatus === "rejected" && t.adminNote && (
                      <p className="mt-1 text-xs text-red-500 leading-snug">{t.adminNote}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    {t.publishStatus === "published" && t.slug && (
                      <Link
                        href={`/terrains/${t.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-[#C8922A] hover:underline"
                      >
                        Voir la fiche →
                      </Link>
                    )}
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
