import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./_components/DeleteButton";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN:         "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  AVAILABLE:  { label: "Disponible",   classes: "bg-emerald-50 text-emerald-700" },
  RESERVED:   { label: "Réservé",      classes: "bg-[#0066CC]/10 text-[#0066CC]" },
  RENTED:     { label: "Loué",         classes: "bg-orange-50 text-orange-700" },
  OFF_MARKET: { label: "Hors marché",  classes: "bg-slate-100 text-slate-600" },
};

function formatPrice(price: unknown) {
  const n = Number(price);
  return new Intl.NumberFormat("fr-FR").format(n) + " XOF";
}

export default async function BiensPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true } } },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Biens immobiliers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {properties.length} bien{properties.length !== 1 ? "s" : ""} enregistré{properties.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/biens/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un bien
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">Aucun bien enregistré</p>
          <p className="text-sm text-slate-400 mt-1">Commencez par ajouter votre premier bien.</p>
          <Link
            href="/dashboard/biens/new"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors"
          >
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prix</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Détails</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((p) => {
                const status = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.OFF_MARKET;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Photo + titre */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-slate-400 truncate">{p.owner.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Localisation */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <p>{p.city}</p>
                      <p className="text-xs text-slate-400">{COUNTRY_LABEL[p.country]}</p>
                    </td>

                    {/* Prix */}
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(p.price)}
                    </td>

                    {/* Statut */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Détails */}
                    <td className="px-4 py-3.5 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      <span>{p.bedrooms} ch.</span>
                      <span className="mx-1 text-slate-300">·</span>
                      <span>{p.bathrooms} sdb</span>
                      <span className="mx-1 text-slate-300">·</span>
                      <span>{p.area}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/biens/${p.id}/edit`}
                          title="Modifier"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-[#0066CC]/10 hover:text-[#0066CC] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <DeleteButton id={p.id} />
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
