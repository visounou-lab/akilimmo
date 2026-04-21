import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatFCFA } from "@/lib/share";
import { getMockActivity } from "./_mock/data";

// TODO V2 : assigner dynamiquement un conseiller par propriétaire (champ advisorId sur User)
const ADVISOR = {
  name:     "David Ayina",
  initials: "DA",
  title:    "Directeur Commercial · AKIL IMMO",
  phone:    "2290197598682",
};

function openAdvisorWhatsApp(ownerName: string) {
  const msg = `Bonjour David, je suis ${ownerName} et je souhaite vous parler de mes biens sur AKIL IMMO.`;
  return `https://wa.me/${ADVISOR.phone}?text=${encodeURIComponent(msg)}`;
}

const PROPERTY_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  RENTED:     { label: "Loué",       bg: "#E1F5EE", text: "#0F6E56" },
  RESERVED:   { label: "Partiel",    bg: "#FAEEDA", text: "#854F0B" },
  AVAILABLE:  { label: "Disponible", bg: "#E6F1FB", text: "#185FA5" },
  OFF_MARKET: { label: "Hors marché",bg: "#F1F5F9", text: "#64748B" },
};

const DOC_TYPES = [
  { type: "quittance", label: "Demander une quittance mensuelle" },
  { type: "contrat",   label: "Demander un contrat de location" },
  { type: "releve",    label: "Demander un relevé annuel" },
];

const ACTIVITY_ICON: Record<string, { bg: string; icon: React.ReactNode }> = {
  payment: {
    bg: "#DBEAFE",
    icon: (
      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  tenant: {
    bg: "#D1FAE5",
    icon: (
      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  photos: {
    bg: "#EDE9FE",
    icon: (
      <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
};

export default async function OwnerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId   = (session.user as { id: string }).id;
  const userName = session.user.name ?? "Propriétaire";
  const firstName = userName.split(" ").at(-1) ?? userName;

  const now               = new Date();
  const startCurrent      = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrev         = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel        = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(now).toUpperCase();

  const [properties, currentRevAgg, prevRevAgg, rentedCount] = await Promise.all([
    prisma.property.findMany({
      where:   { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        images:    { where: { isPrimary: true }, take: 1 },
        contracts: { where: { status: "ACTIVE" }, select: { endDate: true, rentAmount: true }, take: 1 },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startCurrent }, contract: { ownerId: userId } },
      _sum:  { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startPrev, lt: startCurrent }, contract: { ownerId: userId } },
      _sum:  { amount: true },
    }),
    prisma.contract.count({ where: { ownerId: userId, status: "ACTIVE" } }),
  ]);

  const currentRevenue = Number(currentRevAgg._sum.amount ?? 0);
  const prevRevenue    = Number(prevRevAgg._sum.amount ?? 0);
  const percentChange  = prevRevenue > 0
    ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
    : null;
  const totalCount     = properties.length;

  const activity = getMockActivity(properties.map((p) => p.title));
  const whatsappUrl = openAdvisorWhatsApp(userName);

  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5 max-w-2xl mx-auto space-y-3">

      {/* ── 1. Revenus du mois ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm text-slate-500">Bonjour M. {firstName}</p>
        <p className="text-xs text-slate-400 mt-0.5">Voici l'état de vos biens ce mois</p>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Revenus {monthLabel}</p>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-medium text-slate-900">
              {new Intl.NumberFormat("fr-FR").format(Math.round(currentRevenue))}
              <span className="text-base font-normal text-slate-400 ml-1">FCFA</span>
            </span>
            {percentChange !== null && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${
                  percentChange >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {percentChange >= 0 ? "↗" : "↘"} {percentChange >= 0 ? "+" : ""}{percentChange}% vs mois précédent
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{rentedCount}</span> bien{rentedCount !== 1 ? "s" : ""} sur{" "}
            <span className="font-semibold text-slate-800">{totalCount}</span>{" "}
            {totalCount !== 1 ? "sont loués" : "est loué"}
          </span>
        </div>
      </div>

      {/* ── 2. Conseiller dédié ─────────────────────────────────── */}
      {/* TODO V2 : assigner dynamiquement un conseiller par propriétaire */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{ADVISOR.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Votre conseiller dédié</p>
          <p className="text-sm font-medium text-slate-800 mt-0.5">{ADVISOR.name}</p>
          <p className="text-xs text-slate-500">{ADVISOR.title}</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter David Ayina sur WhatsApp"
          className="w-[34px] h-[34px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0 hover:bg-[#1db954] transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.529 5.855L0 24l6.293-1.501A11.964 11.964 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.213-3.727.889.924-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
          </svg>
        </a>
      </div>

      {/* ── 3. Mes biens ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Mes biens</h2>
          <Link href="/owner/dashboard/biens" className="text-xs text-[#0066CC] hover:underline font-medium">
            Voir tout →
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">Aucun bien enregistré.</p>
            <Link href="/owner/dashboard/soumettre" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066CC] hover:underline">
              Soumettre votre premier bien →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.map((p) => {
              const badge     = PROPERTY_BADGE[p.status] ?? PROPERTY_BADGE.OFF_MARKET;
              const heroUrl   = p.images[0]?.url ?? null;
              const contract  = p.contracts[0];
              const price     = new Intl.NumberFormat("fr-FR").format(Number(p.price));

              return (
                <Link
                  key={p.id}
                  href="/owner/dashboard/biens"
                  className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Miniature */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {heroUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={heroUrl} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{p.title}</p>
                      <span
                        className="inline-flex shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {contract?.endDate
                        ? `Jusqu'au ${new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(contract.endDate))} · `
                        : ""}
                      {price} FCFA/nuit
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 4. Activité récente ──────────────────────────────────── */}
      {activity.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Activité récente</h2>
            <span className="text-xs text-slate-400">7 derniers jours</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activity.map((item, i) => {
              const ic = ACTIVITY_ICON[item.type];
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: ic.bg }}
                  >
                    {ic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">{item.title}</p>
                    {/* ANTI-DÉSINTERMÉDIATION : on n'affiche jamais le nom du locataire */}
                    <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    Il y a {item.daysAgo} j.
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Besoin d'un document ? ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-violet-600" style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Besoin d'un document ?</p>
            <p className="text-xs text-slate-500 mt-0.5">Votre conseiller prépare et vous envoie le document sous 24h.</p>
          </div>
        </div>

        <div className="space-y-2">
          {DOC_TYPES.map(({ type, label }) => (
            <Link
              key={type}
              href={`/owner/dashboard/demandes/nouvelle?type=${type}`}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white hover:bg-slate-50 hover:border-[#0066CC]/30 transition-colors text-sm text-slate-700 font-medium"
            >
              <span>{label}</span>
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
