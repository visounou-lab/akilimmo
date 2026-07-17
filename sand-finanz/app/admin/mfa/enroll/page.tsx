import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth/server";
import { totpAuthUri } from "@/lib/auth/totp";
import { enrollMfaAction } from "@/app/admin/actions";
import { AuthCard } from "@/components/admin/AuthCard";
import { TotpInput } from "@/components/admin/TotpInput";

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.totpSecret) redirect("/admin/login");
  if (user.mfaEnabled) redirect("/admin/mfa");

  const uri = totpAuthUri(user.email, user.totpSecret);
  const qr = await QRCode.toDataURL(uri, { margin: 1, width: 220 });

  return (
    <AuthCard>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>
        Zwei-Faktor-Authentifizierung einrichten
      </h1>
      <p style={{ color: "var(--color-sand-muted)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
        Scannen Sie den QR-Code mit einer Authenticator-App (z. B. Google Authenticator, 1Password)
        und geben Sie anschließend den erzeugten Code ein.
      </p>

      <div style={{ display: "grid", placeItems: "center", marginTop: "1.25rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="TOTP QR-Code" width={220} height={220} style={{ borderRadius: "12px" }} />
      </div>
      <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-sand-muted)", textAlign: "center", wordBreak: "break-all" }}>
        Manueller Schlüssel: <code style={{ fontWeight: 700 }}>{user.totpSecret}</code>
      </p>

      {error && (
        <p role="alert" style={{ marginTop: "1rem", color: "#b91c1c", fontSize: "0.9rem" }}>
          Der Code ist ungültig. Bitte erneut versuchen.
        </p>
      )}

      <form action={enrollMfaAction} style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
        <TotpInput />
        <button type="submit" className="sand-btn sand-btn-primary">Aktivieren &amp; anmelden</button>
      </form>
    </AuthCard>
  );
}
