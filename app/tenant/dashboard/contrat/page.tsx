import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatPrice(n: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(n)) + " FCFA";
}

const CONTRACT_STATUS: Record<string, { label: string; classes: string }> = {
  ACTIVE:     { label: "Actif",    classes: "bg-emerald-50 text-emerald-700" },
  PENDING:    { label: "En attente", classes: "bg-amber-50 text-amber-700"  },
  TERMINATED: { label: "Résilié", classes: "bg-red-50 text-red-700"         },
};

export default async function TenantContratPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const contracts = await prisma.contract.findMany({
    where:   { tenantId: userId },
    orderBy: { startDate: "desc" },
    include: {
      property: {
        select: {
          title:   true,
          city:    true,
          country: true,
          address: true,
          images:  { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      },
    },
  });

  if (contracts.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Mon contrat</h1>
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <p className="text-slate-500 font-medium">Aucun contrat enregistré</p>
          <p className="text-sm text-slate-400 mt-1">Contactez AKIL IMMO pour toute question.</p>
        </div>
      </div>
    );
  }

  const COUNTRY_LABELS: Record<string, string> = { BENIN: "Bénin", COTE_D_IVOIRE: "Côte d'Ivoire" };

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon contrat</h1>
        <p className="text-sm text-slate-500 mt-0.5">Détails de votre location</p>
      </div>

      <div className="space-y-4">
        {contracts.map((c) => {
          const st    = CONTRACT_STATUS[c.status] ?? CONTRACT_STATUS.PENDING;
          const thumb = c.property.images[0]?.url;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Thumbnail */}
              {thumb && (
                <div className="h-40 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={c.property.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{c.property.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {c.property.address} · {c.property.city}, {COUNTRY_LABELS[c.property.country] ?? c.property.country}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${st.classes}`}>
                    {st.label}
                  </span>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
                  {[
                    { label: "Loyer mensuel",  value: formatPrice(c.rentAmount) },
                    { label: "Début",          value: formatDate(c.startDate)   },
                    { label: "Fin",            value: formatDate(c.endDate)     },
                    { label: "Référence",      value: c.id.slice(-8).toUpperCase() },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{row.value}</p>
                    </div>
                  ))}
                </div>

                {/* Gestionnaire */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-[#0066CC] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Géré par</p>
                    <p className="text-sm font-semibold text-slate-800">AKIL IMMO</p>
                  </div>
                  <a
                    href="https://wa.me/2290197598682?text=Bonjour%20AKIL%20IMMO%2C%20j%27ai%20une%20question%20concernant%20mon%20contrat."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 hover:bg-[#1db954] transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.529 5.855L0 24l6.293-1.501A11.964 11.964 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.213-3.727.889.924-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
