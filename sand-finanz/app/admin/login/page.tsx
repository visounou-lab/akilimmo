import { Logo } from "@/components/Logo";
import { loginAction } from "@/app/admin/actions";
import { AuthCard } from "@/components/admin/AuthCard";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthCard>
      <Logo />
      <h1 style={{ marginTop: "1rem", fontSize: "1.3rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>
        Administration
      </h1>
      <p style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
        Bitte melden Sie sich an. Zwei-Faktor-Authentifizierung ist erforderlich.
      </p>

      {error && (
        <p role="alert" style={{ marginTop: "1rem", color: "#b91c1c", fontSize: "0.9rem" }}>
          E-Mail oder Passwort ist ungültig.
        </p>
      )}

      <form action={loginAction} style={{ marginTop: "1.25rem", display: "grid", gap: "1rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>E-Mail</span>
          <input className="sand-field" type="email" name="email" autoComplete="username" required />
        </label>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Passwort</span>
          <input className="sand-field" type="password" name="password" autoComplete="current-password" required />
        </label>
        <button type="submit" className="sand-btn sand-btn-primary">Weiter</button>
      </form>
    </AuthCard>
  );
}
