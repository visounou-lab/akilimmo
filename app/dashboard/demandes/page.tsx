import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const TYPE_LABELS: Record<string, string> = {
  quittance:   "Quittance de loyer",
  contrat:     "Contrat de location",
  attestation: "Attestation de propriété",
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:    { label: "En attente", bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400"   },
  processing: { label: "En cours",   bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400"    },
  delivered:  { label: "Transmis",   bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
};

async function markDelivered(id: string) {
  "use server";
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/login");
  await prisma.documentRequest.update({
    where: { id },
    data: { status: "delivered", deliveredAt: new Date() },
  });
  revalidatePath("/dashboard/demandes");
}

async function markProcessing(id: string) {
  "use server";
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/login");
  await prisma.documentRequest.update({
    where: { id },
    data: { status: "processing", deliveredAt: null },
  });
  revalidatePath("/dashboard/demandes");
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

interface SearchParams { status?: string }

export default async function AdminDemandesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status: filter } = await searchParams;

  const where = filter && filter !== "all"
    ? { status: filter }
    : {};

  const [requests, counts] = await Promise.all([
    prisma.documentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        owner:    { select: { name: true, email: true } },
        property: { select: { title: true, city: true } },
      },
    }),
    prisma.documentRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const totalPending = (countMap["pending"] ?? 0) + (countMap["processing"] ?? 0);

  const TABS = [
    { key: "all",        label: "Toutes",     count: requests.length > 0 || !filter ? undefined : undefined },
    { key: "pending",    label: "En attente", count: countMap["pending"] },
    { key: "processing", label: "En cours",   count: countMap["processing"] },
    { key: "delivered",  label: "Transmises", count: countMap["delivered"] },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demandes de documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">Demandes émises par les propriétaires</p>
        </div>
        {totalPending > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {totalPending} en attente
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const active = (filter ?? "all") === tab.key;
          return (
            <a
              key={tab.key}
              href={tab.key === "all" ? "/dashboard/demandes" : `/dashboard/demandes?status=${tab.key}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.count != null && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  active ? "bg-[#0066CC] text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <p className="text-slate-500 font-medium">Aucune demande pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const st = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
            const typeLabel = TYPE_LABELS[r.type] ?? r.type;
            const isPending   = r.status === "pending";
            const isProcessing = r.status === "processing";

            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#0066CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-slate-900">{typeLabel}</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>

                    {/* Owner */}
                    <p className="text-xs text-slate-600 font-medium">
                      {r.owner.name ?? r.owner.email}
                      <span className="font-normal text-slate-400 ml-1">· {r.owner.email}</span>
                    </p>

                    {r.property && (
                      <p className="text-xs text-slate-400 mt-0.5">{r.property.title} — {r.property.city}</p>
                    )}

                    {r.message && (
                      <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed">
                        {r.message}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <p className="text-xs text-slate-400">Reçue le {formatDate(r.createdAt)}</p>
                      {r.deliveredAt && (
                        <p className="text-xs text-emerald-600">· Transmis le {formatDate(r.deliveredAt)}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {isPending && (
                      <form action={markProcessing.bind(null, r.id)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors whitespace-nowrap"
                        >
                          Prendre en charge
                        </button>
                      </form>
                    )}
                    {(isPending || isProcessing) && (
                      <form action={markDelivered.bind(null, r.id)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap"
                        >
                          Marquer transmis
                        </button>
                      </form>
                    )}
                    {r.status === "delivered" && (
                      <span className="text-xs text-slate-400">Traité ✓</span>
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
