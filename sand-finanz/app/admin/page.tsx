import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatMoney } from "@/lib/credit-engine";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;
  const user = await requireUser();

  const [total, byStatus, recent] = await Promise.all([
    prisma.application.count(),
    prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { customer: true } }),
  ]);
  const count = (status: string) => byStatus.find((s) => s.status === status)?._count._all ?? 0;
  const pending = count("SUBMITTED") + count("DOCUMENTS_PENDING") + count("UNDER_REVIEW") + count("ON_HOLD");

  const kpis = [
    { label: "Gesamtanträge", value: total, icon: "🗂️", bg: "#eef3fc", fg: "#2666eb", href: "/admin/applications" },
    { label: "Ausstehend", value: pending, icon: "⏳", bg: "#fef6e7", fg: "#b45309", href: "/admin/applications?status=SUBMITTED" },
    { label: "Genehmigt", value: count("APPROVED"), icon: "✅", bg: "#e9f7ef", fg: "#15803d", href: "/admin/applications?status=APPROVED" },
    { label: "Abgelehnt", value: count("DECLINED"), icon: "❌", bg: "#fdecec", fg: "#b91c1c", href: "/admin/applications?status=DECLINED" },
  ];

  return (
    <AdminShell user={user} active="/admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Willkommen, {user.name}</h1>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download route, must be a real navigation */}
          <a href="/admin/applications/export" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.85rem" }}>⭳ CSV exportieren</a>
          <Link href="/admin" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.85rem" }}>↻ Aktualisieren</Link>
        </div>
      </div>

      {denied && (
        <p role="alert" style={{ marginTop: "1rem", background: "#fff5e6", border: "1px solid #ffd699", color: "#8a5a00", borderRadius: "10px", padding: "0.7rem 1rem", fontSize: "0.9rem" }}>
          Für diese Aktion fehlt Ihnen die Berechtigung.
        </p>
      )}

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} style={{ textDecoration: "none", background: k.bg, borderRadius: "16px", padding: "1.4rem", display: "block" }}>
            <div style={{ fontSize: "1.4rem" }} aria-hidden="true">{k.icon}</div>
            <div style={{ fontSize: "2.1rem", fontWeight: 800, color: k.fg, marginTop: "0.4rem" }}>{k.value}</div>
            <div style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.15rem" }}>{k.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: "2rem", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>Letzte Anträge</h2>
      <div className="sand-card" style={{ marginTop: "0.75rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "620px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.75rem 1rem" }}>Aktenzeichen</th>
              <th style={{ padding: "0.75rem 1rem" }}>Kunde</th>
              <th style={{ padding: "0.75rem 1rem" }}>Betrag</th>
              <th style={{ padding: "0.75rem 1rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "1rem", color: "var(--color-sand-muted)" }}>Noch keine Anträge.</td></tr>
            )}
            {recent.map((a) => (
              <tr key={a.reference} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <Link href={`/admin/applications/${a.reference}`} style={{ color: "var(--color-sand-cta)", fontWeight: 600, textDecoration: "none" }}>{a.reference}</Link>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{a.customer.firstName} {a.customer.lastName}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{formatMoney(a.amount, a.currency, "de-DE")}</td>
                <td style={{ padding: "0.75rem 1rem" }}><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
