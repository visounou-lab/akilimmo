import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PUBLISH_STATUS: Record<string, { label: string; classes: string; dot: string }> = {
  draft:          { label: "Brouillon",   classes: "bg-slate-100 text-slate-500",   dot: "bg-slate-400" },
  pending_review: { label: "En révision", classes: "bg-amber-50 text-amber-600",   dot: "bg-amber-400" },
  published:      { label: "Publié",      classes: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  rejected:       { label: "Refusé",      classes: "bg-red-50 text-red-600",        dot: "bg-red-500" },
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function OwnerBiensPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string })?.id!;

  const biens = await prisma.property.findMany({
    where:   { submittedBy: userId },
    orderBy: { createdAt: "desc" },
    select:  { id: true, title: true, city: true, country: true, price: true, publishStatus: true, adminNote: true, createdAt: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes biens</h1>
          <p className="text-sm text-slate-500 mt-0.5">{biens.length} bien{biens.length !== 1 ? "s" : ""} soumis</p>
        </div>
        <Link href="/owner/dashboard/soumettre"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Soumettre un bien
        </Link>
      </div>

      {biens.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-slate-500 font-medium">Vous n&apos;avez pas encore soumis de bien.</p>
          <p className="text-sm text-slate-400 mt-1">Commencez par soumettre votre premier bien à la location.</p>
          <Link href="/owner/dashboard/soumettre"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition">
            Soumettre un bien
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                {["Bien", "Ville", "Prix / nuit", "Statut", "Soumis le", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {biens.map((b) => {
                const st = PUBLISH_STATUS[b.publishStatus] ?? PUBLISH_STATUS.draft;
                const price = new Intl.NumberFormat("fr-FR").format(Number(b.price));
                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-800">{b.title}</td>
                    <td className="px-4 py-3.5 text-slate-500">{b.city}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{price} XOF</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                        {b.publishStatus === "rejected" && b.adminNote && (
                          <p className="mt-1 text-xs text-red-500 max-w-xs">{b.adminNote}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      {b.publishStatus === "published" && (
                        <Link href={`/biens/${b.id}`} target="_blank"
                          className="text-xs text-[#0066CC] hover:underline font-medium whitespace-nowrap">
                          Voir sur le site →
                        </Link>
                      )}
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
