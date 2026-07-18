import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { can, ROLE_LABELS } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { changeOwnPasswordAction } from "./actions";
import { createUserAction, resetMfaAction, setUserStatusAction } from "../users/actions";

export default async function ZugangPage({
  searchParams,
}: {
  searchParams: Promise<{ pw?: string; error?: string }>;
}) {
  const me = await requireUser();
  const { pw, error } = await searchParams;
  const manageUsers = can(me.role, "users.manage");
  const users = manageUsers ? await prisma.user.findMany({ orderBy: { createdAt: "asc" } }) : [];

  return (
    <AdminShell user={me} active="/admin/zugang">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Zugang &amp; Sicherheit</h1>

      {/* Own account */}
      <div className="sand-card" style={{ marginTop: "1.25rem", padding: "1.5rem", maxWidth: "560px" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>Mein Konto</h2>
        <p style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          {me.email} · {ROLE_LABELS[me.role]} · 2FA: {me.mfaEnabled ? "aktiv ✓" : "nicht eingerichtet"}
        </p>
        {pw === "ok" && <p style={{ color: "#15803d", marginTop: "0.75rem", fontSize: "0.9rem" }}>Passwort aktualisiert.</p>}
        {pw === "wrong" && <p style={{ color: "#b91c1c", marginTop: "0.75rem", fontSize: "0.9rem" }}>Aktuelles Passwort ist falsch.</p>}
        {pw === "invalid" && <p style={{ color: "#b91c1c", marginTop: "0.75rem", fontSize: "0.9rem" }}>Neues Passwort ungültig (≥ 8 Zeichen, muss übereinstimmen).</p>}

        <form action={changeOwnPasswordAction} style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
          <input className="sand-field" name="current" type="password" placeholder="Aktuelles Passwort" autoComplete="current-password" required />
          <input className="sand-field" name="next" type="password" placeholder="Neues Passwort (≥ 8)" autoComplete="new-password" minLength={8} required />
          <input className="sand-field" name="confirm" type="password" placeholder="Neues Passwort bestätigen" autoComplete="new-password" minLength={8} required />
          <div><button type="submit" className="sand-btn sand-btn-primary">Passwort ändern</button></div>
        </form>
      </div>

      {/* User management (super-admin) */}
      {manageUsers && (
        <>
          <h2 style={{ marginTop: "2rem", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Benutzerverwaltung</h2>
          {error && (
            <p role="alert" style={{ marginTop: "0.75rem", color: "#b91c1c", fontSize: "0.9rem" }}>
              {error === "exists" ? "Diese E-Mail existiert bereits." : "Bitte alle Felder korrekt ausfüllen (Passwort ≥ 8 Zeichen)."}
            </p>
          )}

          <form action={createUserAction} className="sand-card" style={{ marginTop: "1rem", padding: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", maxWidth: "820px" }}>
            <Labeled label="Name"><input className="sand-field" name="name" required /></Labeled>
            <Labeled label="E-Mail"><input className="sand-field" name="email" type="email" required /></Labeled>
            <Labeled label="Passwort (≥ 8)"><input className="sand-field" name="password" type="password" required minLength={8} /></Labeled>
            <Labeled label="Rolle">
              <select className="sand-field" name="role" defaultValue="READ_ONLY">
                {Object.entries(ROLE_LABELS).map(([r, l]) => <option key={r} value={r}>{l}</option>)}
              </select>
            </Labeled>
            <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="sand-btn sand-btn-primary">Benutzer anlegen</button></div>
          </form>

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
                    <td style={{ padding: "0.7rem 1rem" }}>{u.mfaEnabled ? "✓" : "—"}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>{u.status === "ACTIVE" ? "Aktiv" : "Deaktiviert"}</td>
                    <td style={{ padding: "0.7rem 1rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {u.id !== me.id && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="disable" value={u.status === "ACTIVE" ? "1" : "0"} />
                          <button type="submit" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.78rem", padding: "0.35rem 0.6rem" }}>{u.status === "ACTIVE" ? "Deaktivieren" : "Aktivieren"}</button>
                        </form>
                      )}
                      {u.mfaEnabled && (
                        <form action={resetMfaAction}>
                          <input type="hidden" name="id" value={u.id} />
                          <button type="submit" className="sand-btn sand-btn-ghost" style={{ fontSize: "0.78rem", padding: "0.35rem 0.6rem" }}>2FA zurücksetzen</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: "0.3rem" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}
