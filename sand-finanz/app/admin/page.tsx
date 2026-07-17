import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";

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
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { customer: true },
    }),
  ]);

  const count = (status: string) => byStatus.find((s) => s.status === status)?._count._all ?? 0;

  const kpis = [
    { label: "Neue Anträge", value: count("SUBMITTED"), href: "/admin/applications?status=SUBMITTED" },
    { label: "Unterlagen ausstehend", value: count("DOCUMENTS_PENDING"), href: "/admin/applications?status=DOCUMENTS_PENDING" },
    { label: "In Prüfung", value: count("UNDER_REVIEW"), href: "/admin/applications?status=UNDER_REVIEW" },
    { label: "Genehmigt", value: count("APPROVED"), href: "/admin/applications?status=APPROVED" },
    { label: "Abgelehnt", value: count("DECLINED"), href: "/admin/applications?status=DECLINED" },
    { label: "Anträge gesamt", value: total, href: "/admin/applications" },
  ];

  return (
    <AdminShell user={user} active="/admin">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Dashboard</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>Willkommen, {user.name}.</p>

      {denied && (
        <p role="alert" style={{ marginTop: "1rem", background: "#fff5e6", border: "1px solid #ffd699", color: "#8a5a00", borderRadius: "10px", padding: "0.7rem 1rem", fontSize: "0.9rem" }}>
          Für diese Aktion fehlt Ihnen die Berechtigung.
        </p>
      )}

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="sand-card" style={{ padding: "1.25rem", textDecoration: "none" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>{k.value}</div>
            <div style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>{k.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: "2rem", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>Neueste Anträge</h2>
      <div className="sand-card" style={{ marginTop: "0.75rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "560px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.75rem 1rem" }}>Referenz</th>
              <th style={{ padding: "0.75rem 1rem" }}>Kunde</th>
              <th style={{ padding: "0.75rem 1rem" }}>Produkt</th>
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
                  <Link href={`/admin/applications/${a.reference}`} style={{ color: "var(--color-sand-cta)", fontWeight: 600, textDecoration: "none" }}>
                    {a.reference}
                  </Link>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{a.customer.firstName} {a.customer.lastName}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{a.productType}</td>
                <td style={{ padding: "0.75rem 1rem" }}><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
