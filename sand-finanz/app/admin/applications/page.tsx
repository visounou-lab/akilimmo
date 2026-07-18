import Link from "next/link";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/application-status";
import { formatMoney, calculate, validate } from "@/lib/credit-engine";
import { getPublishedCatalog } from "@/lib/catalog-server";
import { deleteApplicationAction } from "./actions";

const CHIPS: Array<{ label: string; status?: ApplicationStatus }> = [
  { label: "Alle" },
  { label: "Ausstehend", status: "SUBMITTED" },
  { label: "In Prüfung", status: "UNDER_REVIEW" },
  { label: "Genehmigt", status: "APPROVED" },
  { label: "Abgelehnt", status: "DECLINED" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await requireUser();
  const canDelete = can(user.role, "applications.delete");
  const { status, q } = await searchParams;

  const where: Prisma.ApplicationWhereInput = {};
  if (status && (ALL_STATUSES as string[]).includes(status)) where.status = status as ApplicationStatus;
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { reference: { contains: term, mode: "insensitive" } },
      { customer: { is: { lastName: { contains: term, mode: "insensitive" } } } },
      { customer: { is: { firstName: { contains: term, mode: "insensitive" } } } },
      { customer: { is: { email: { contains: term, mode: "insensitive" } } } },
    ];
  }

  const [applications, catalog] = await Promise.all([
    prisma.application.findMany({ where, orderBy: { createdAt: "desc" }, include: { customer: true }, take: 200 }),
    getPublishedCatalog(),
  ]);

  const rate = (a: (typeof applications)[number]): number | null => {
    const p = catalog.find((c) => c.productType === a.productType);
    if (!p) return null;
    const input = { principal: a.amount, termMonths: a.termMonths };
    if (validate(input, p).length > 0) return null;
    return calculate(input, p).monthlyPayment;
  };

  const exportHref = `/admin/applications/export?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}) })}`;

  return (
    <AdminShell user={user} active="/admin/applications">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Kreditanträge</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download route, must be a real navigation */}
        <a href={exportHref} className="sand-btn sand-btn-ghost" style={{ fontSize: "0.85rem" }}>⭳ CSV exportieren</a>
      </div>

      {/* Filter chips + search */}
      <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {CHIPS.map((chip) => {
            const isActive = (chip.status ?? "") === (status ?? "");
            const href = chip.status ? `/admin/applications?status=${chip.status}` : "/admin/applications";
            return (
              <Link
                key={chip.label}
                href={href}
                className="sand-btn"
                style={{
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  background: isActive ? "var(--color-sand-navy)" : "#fff",
                  color: isActive ? "#fff" : "var(--color-sand-navy)",
                  border: isActive ? "none" : "1px solid var(--color-sand-border)",
                }}
              >
                {chip.label}
              </Link>
            );
          })}
        </div>
        <form>
          {status && <input type="hidden" name="status" value={status} />}
          <input className="sand-field" name="q" defaultValue={q ?? ""} placeholder="Nach Name, E-Mail oder Referenz suchen…" style={{ minWidth: "260px" }} />
        </form>
      </div>

      <div className="sand-card" style={{ marginTop: "1.25rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "880px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.7rem 1rem" }}>Referenz</th>
              <th style={{ padding: "0.7rem 1rem" }}>Kunde</th>
              <th style={{ padding: "0.7rem 1rem" }}>E-Mail</th>
              <th style={{ padding: "0.7rem 1rem" }}>Betrag</th>
              <th style={{ padding: "0.7rem 1rem" }}>Monatsrate</th>
              <th style={{ padding: "0.7rem 1rem" }}>Status</th>
              <th style={{ padding: "0.7rem 1rem" }}>Datum</th>
              <th style={{ padding: "0.7rem 1rem" }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr><td colSpan={8} style={{ padding: "1rem", color: "var(--color-sand-muted)" }}>Keine Anträge gefunden.</td></tr>
            )}
            {applications.map((a) => {
              const r = rate(a);
              return (
                <tr key={a.reference} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                  <td style={{ padding: "0.7rem 1rem" }}>
                    <Link href={`/admin/applications/${a.reference}`} style={{ color: "var(--color-sand-cta)", fontWeight: 600, textDecoration: "none" }}>{a.reference}</Link>
                  </td>
                  <td style={{ padding: "0.7rem 1rem" }}>{a.customer.firstName} {a.customer.lastName}</td>
                  <td style={{ padding: "0.7rem 1rem", color: "var(--color-sand-muted)" }}>{a.customer.email}</td>
                  <td style={{ padding: "0.7rem 1rem", fontWeight: 600 }}>{formatMoney(a.amount, a.currency, "de-DE")}</td>
                  <td style={{ padding: "0.7rem 1rem" }}>{r != null ? formatMoney(r, a.currency, "de-DE") : "—"}</td>
                  <td style={{ padding: "0.7rem 1rem" }}><StatusBadge status={a.status} /></td>
                  <td style={{ padding: "0.7rem 1rem", color: "var(--color-sand-muted)", whiteSpace: "nowrap" }}>{new Date(a.createdAt).toLocaleDateString("de-DE")}</td>
                  <td style={{ padding: "0.7rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <Link href={`/admin/applications/${a.reference}`} className="sand-btn sand-btn-primary" style={{ fontSize: "0.78rem", padding: "0.35rem 0.7rem" }}>Bearbeiten</Link>
                      {canDelete && (
                        <form action={deleteApplicationAction}>
                          <input type="hidden" name="reference" value={a.reference} />
                          <button type="submit" className="sand-btn" style={{ fontSize: "0.78rem", padding: "0.35rem 0.7rem", background: "#dc2626", color: "#fff" }}>Löschen</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
