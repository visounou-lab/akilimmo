import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:   { label: "En attente",  bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  contacted: { label: "Contacté",   bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  confirmed: { label: "Confirmé",   bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  cancelled: { label: "Annulé",     bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
};

const sectionTitle: React.CSSProperties = {
  fontSize: "0.625rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#C8922A",
  marginBottom: "0.25rem",
};

export default async function OwnerReservationsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!session?.user || user?.role !== "OWNER") redirect("/login");

  const userId = user!.id!;

  const reservations = await prisma.reservationRequest.findMany({
    where: { property: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: { id: true, title: true, city: true, slug: true },
      },
    },
  });

  const pending = reservations.filter((r) => r.status === "pending").length;

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  const fmtPrice = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p style={sectionTitle}>MES BIENS</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            color: "#1C1917",
            letterSpacing: "-0.01em",
          }}
        >
          Demandes de réservation
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B5E52" }}>
          {reservations.length} demande{reservations.length !== 1 ? "s" : ""} au total
          {pending > 0 && (
            <span
              className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
            >
              {pending} en attente
            </span>
          )}
        </p>
      </div>

      {reservations.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            backgroundColor: "#FDFCF8",
            border: "1.5px solid rgba(200,146,42,0.2)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(200,146,42,0.1)" }}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#C8922A" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "#6B5E52" }}>
            Aucune demande de réservation pour vos biens pour le moment.
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(107,94,82,0.6)" }}>
            Les demandes apparaîtront ici dès qu&apos;un locataire s&apos;intéressera à votre bien.
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#FDFCF8",
            border: "1.5px solid rgba(200,146,42,0.2)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(200,146,42,0.15)", backgroundColor: "rgba(200,146,42,0.04)" }}>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Bien</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Client</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Dates</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Durée</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Total</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B5E52" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={r.id}
                      style={{ borderBottom: "1px solid rgba(200,146,42,0.08)" }}
                    >
                      {/* Bien */}
                      <td className="px-5 py-4">
                        <p className="font-medium leading-snug" style={{ color: "#1C1917" }}>{r.property.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#C8922A" }}>{r.property.city}</p>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-4">
                        <p className="font-medium" style={{ color: "#1C1917" }}>{r.clientName}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(107,94,82,0.7)" }}>
                          {r.clientPhone}
                        </p>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 text-xs whitespace-nowrap" style={{ color: "#3D3530" }}>
                        <p>{fmtDate(r.checkIn)}</p>
                        <p style={{ color: "rgba(107,94,82,0.6)" }}>→ {fmtDate(r.checkOut)}</p>
                      </td>

                      {/* Durée */}
                      <td className="px-4 py-4 text-xs whitespace-nowrap" style={{ color: "#3D3530" }}>
                        {r.duration} {r.locationType}{r.duration > 1 ? "s" : ""}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4 text-right whitespace-nowrap font-semibold" style={{ color: "#1C1917" }}>
                        {fmtPrice(r.totalPrice)}{" "}
                        <span className="font-normal text-xs" style={{ color: "rgba(107,94,82,0.6)" }}>XOF</span>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note info */}
      <p className="text-xs text-center" style={{ color: "rgba(107,94,82,0.5)" }}>
        Les statuts sont mis à jour par l&apos;équipe AKIL IMMO. Pour toute question, contactez-nous.
      </p>
    </div>
  );
}
