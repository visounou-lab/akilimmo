import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth/server";
import { verifyMfaAction } from "@/app/admin/actions";
import { AuthCard } from "@/components/admin/AuthCard";
import { TotpInput } from "@/components/admin/TotpInput";

export default async function MfaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  // If MFA is not yet enrolled, send to enrolment instead.
  if (!user || !user.totpSecret) redirect("/admin/login");
  if (!user.mfaEnabled) redirect("/admin/mfa/enroll");

  return (
    <AuthCard>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>
        Zwei-Faktor-Authentifizierung
      </h1>
      <p style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
        Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.
      </p>
      {error && (
        <p role="alert" style={{ marginTop: "1rem", color: "#b91c1c", fontSize: "0.9rem" }}>
          Der Code ist ungültig oder abgelaufen.
        </p>
      )}
      <form action={verifyMfaAction} style={{ marginTop: "1.25rem", display: "grid", gap: "1rem" }}>
        <TotpInput />
        <button type="submit" className="sand-btn sand-btn-primary">Anmelden</button>
      </form>
    </AuthCard>
  );
}
