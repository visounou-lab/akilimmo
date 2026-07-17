import Link from "next/link";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/application-status";
import { formatMoney } from "@/lib/credit-engine";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await requireUser();
  const { status, q } = await searchParams;

  const where: Prisma.ApplicationWhereInput = {};
  if (status && (ALL_STATUSES as string[]).includes(status)) {
    where.status = status as ApplicationStatus;
  }
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { reference: { contains: term, mode: "insensitive" } },
      { customer: { is: { lastName: { contains: term, mode: "insensitive" } } } },
      { customer: { is: { email: { contains: term, mode: "insensitive" } } } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { customer: true, assignedTo: true },
    take: 100,
  });

  return (
    <AdminShell user={user} active="/admin/applications">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Anträge</h1>

      <form style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "end" }}>
        <label style={{ display: "grid", gap: "0.3rem", flex: "1 1 220px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Suche (Referenz, Name, E-Mail)</span>
          <input className="sand-field" name="q" defaultValue={q ?? ""} placeholder="SF-2026-…" />
        </label>
        <label style={{ display: "grid", gap: "0.3rem", flex: "0 0 220px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Status</span>
          <select className="sand-field" name="status" defaultValue={status ?? ""}>
            <option value="">Alle</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="sand-btn sand-btn-primary">Filtern</button>
      </form>

      <div className="sand-card" style={{ marginTop: "1.25rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "720px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.75rem 1rem" }}>Referenz</th>
              <th style={{ padding: "0.75rem 1rem" }}>Kunde</th>
              <th style={{ padding: "0.75rem 1rem" }}>Produkt</th>
              <th style={{ padding: "0.75rem 1rem" }}>Betrag</th>
              <th style={{ padding: "0.75rem 1rem" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem" }}>Zugewiesen</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "1rem", color: "var(--color-sand-muted)" }}>Keine Anträge gefunden.</td></tr>
            )}
            {applications.map((a) => (
              <tr key={a.reference} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <Link href={`/admin/applications/${a.reference}`} style={{ color: "var(--color-sand-cta)", fontWeight: 600, textDecoration: "none" }}>{a.reference}</Link>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{a.customer.firstName} {a.customer.lastName}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{a.productType}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{formatMoney(a.amount, a.currency, "de-DE")}</td>
                <td style={{ padding: "0.75rem 1rem" }}><StatusBadge status={a.status} /></td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--color-sand-muted)" }}>{a.assignedTo?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
