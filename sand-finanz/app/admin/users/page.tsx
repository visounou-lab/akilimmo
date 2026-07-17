import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { createUserAction, resetMfaAction, setUserStatusAction } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const me = await requirePermission("users.manage");
  const { error } = await searchParams;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <AdminShell user={me} active="/admin/users">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Benutzer</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>Interne Konten und Rollen. Neue Benutzer richten beim ersten Login die 2FA ein.</p>

      {error && (
        <p role="alert" style={{ marginTop: "1rem", color: "#b91c1c", fontSize: "0.9rem" }}>
          {error === "exists" ? "Diese E-Mail existiert bereits." : "Bitte alle Felder korrekt ausfüllen (Passwort ≥ 8 Zeichen)."}
        </p>
      )}

      {/* Create */}
      <form action={createUserAction} className="sand-card" style={{ marginTop: "1.25rem", padding: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", maxWidth: "820px" }}>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Name</span>
          <input className="sand-field" name="name" required />
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>E-Mail</span>
          <input className="sand-field" name="email" type="email" required />
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Passwort (≥ 8)</span>
          <input className="sand-field" name="password" type="password" required minLength={8} />
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Rolle</span>
          <select className="sand-field" name="role" defaultValue="READ_ONLY">
            {Object.entries(ROLE_LABELS).map(([r, l]) => <option key={r} value={r}>{l}</option>)}
          </select>
        </label>
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="sand-btn sand-btn-primary">Benutzer anlegen</button>
        </div>
      </form>

      {/* List */}
      <div className="sand-card" style={{ marginTop: "1.25rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "760px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.7rem 1rem" }}>Name</th>
              <th style={{ padding: "0.7rem 1rem" }}>E-Mail</th>
              <th style={{ padding: "0.7rem 1rem" }}>Rolle</th>
              <th style={{ padding: "0.7rem 1rem" }}>2FA</th>
              <th style={{ padding: "0.7rem 1rem" }}>Status</th>
              <th style={{ padding: "0.7rem 1rem" }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                <td style={{ padding: "0.7rem 1rem", fontWeight: 600 }}>{u.name}{u.id === me.id ? " (Sie)" : ""}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{u.email}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{ROLE_LABELS[u.role]}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{u.mfaEnabled ? "✓ aktiv" : "—"}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{u.status === "ACTIVE" ? "Aktiv" : "Deaktiviert"}</td>
                <td style={{ padding: "0.7rem 1rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {u.id !== me.id && (
                    <form action={setUserStatusAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="disable" value={u.status === "ACTIVE" ? "1" : "0"} />
                      <button type="submit" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.7rem" }}>
                        {u.status === "ACTIVE" ? "Deaktivieren" : "Aktivieren"}
                      </button>
                    </form>
                  )}
                  {u.mfaEnabled && (
                    <form action={resetMfaAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.7rem" }}>2FA zurücksetzen</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
