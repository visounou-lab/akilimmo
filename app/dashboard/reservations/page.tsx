import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReservationActions from "./_components/ReservationActions";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:   { label: "En attente",  bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  contacted: { label: "Contacté",   bg: "#DBEAFE", text: "#C8922A", dot: "#3B82F6" },
  confirmed: { label: "Confirmé",   bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  cancelled: { label: "Annulé",     bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
};

export default async function ReservationsPage() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!session?.user || user?.role !== "ADMIN") redirect("/login");

  const reservations = await prisma.reservationRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: { id: true, title: true, city: true, country: true, slug: true },
      },
    },
  }).catch(() => []);

  const pending   = reservations.filter((r) => r.status === "pending").length;
  const contacted = reservations.filter((r) => r.status === "contacted").length;

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  const fmtPrice = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Demandes de réservation</h1>
        <p className="text-sm text-slate-500 mt-1">
          {reservations.length} demande{reservations.length !== 1 ? "s" : ""} au total
          {pending > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {pending} en attente
            </span>
          )}
          {contacted > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {contacted} contacté{contacted > 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-500">Aucune demande de réservation pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durée</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reservations.map((r) => {
                  const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
                  const waMsg = encodeURIComponent(
                    `Bonjour ${r.clientName}, je suis David d'AKIL IMMO. J'ai bien reçu votre demande de réservation pour "${r.property.title}". Pouvons-nous en discuter ?`
                  );
                  const waUrl = `https://wa.me/${r.clientPhone.replace(/\D/g, "")}?text=${waMsg}`;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Bien */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800 leading-snug">{r.property.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{r.property.city}</p>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">{r.clientName}</p>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.529 5.855L0 24l6.293-1.501A11.964 11.964 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.213-3.727.889.924-3.634-.234-.374A9.818 9.818 0 1112 21.818z" />
                          </svg>
                          {r.clientPhone}
                        </a>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 text-slate-600 text-xs whitespace-nowrap">
                        <p>{fmtDate(r.checkIn)}</p>
                        <p className="text-slate-400">→ {fmtDate(r.checkOut)}</p>
                      </td>

                      {/* Durée */}
                      <td className="px-4 py-4 text-slate-600 text-xs whitespace-nowrap">
                        {r.duration} {r.locationType}{r.duration > 1 ? "s" : ""}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                        {fmtPrice(r.totalPrice)} <span className="text-slate-400 font-normal text-xs">XOF</span>
                      </td>

                      {/* Statut */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <ReservationActions id={r.id} currentStatus={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
