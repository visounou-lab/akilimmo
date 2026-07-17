import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AuditPage() {
  const user = await requirePermission("audit.view");
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: true },
  });

  return (
    <AdminShell user={user} active="/admin/audit">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Audit-Log</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>
        Nachvollziehbarkeit sicherheitsrelevanter Aktionen (letzte 200 Einträge).
      </p>

      <div className="sand-card" style={{ marginTop: "1.25rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "760px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.6rem 1rem" }}>Zeitpunkt</th>
              <th style={{ padding: "0.6rem 1rem" }}>Akteur</th>
              <th style={{ padding: "0.6rem 1rem" }}>Aktion</th>
              <th style={{ padding: "0.6rem 1rem" }}>Objekt</th>
              <th style={{ padding: "0.6rem 1rem" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "1rem", color: "var(--color-sand-muted)" }}>Noch keine Einträge.</td></tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}>{new Date(l.createdAt).toLocaleString("de-DE")}</td>
                <td style={{ padding: "0.6rem 1rem" }}>{l.actor?.name ?? "System"}</td>
                <td style={{ padding: "0.6rem 1rem", fontFamily: "monospace" }}>{l.action}</td>
                <td style={{ padding: "0.6rem 1rem", color: "var(--color-sand-muted)" }}>{l.entity}{l.entityId ? ` · ${l.entityId}` : ""}</td>
                <td style={{ padding: "0.6rem 1rem", color: "var(--color-sand-muted)", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {l.metadata ? JSON.stringify(l.metadata) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
