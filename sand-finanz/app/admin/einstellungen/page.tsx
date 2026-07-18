import { requirePermission } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceholderBadge } from "@/components/ui";
import { getCompanySettings } from "@/lib/settings";
import { updateSettingsAction } from "./actions";

export default async function EinstellungenPage() {
  const user = await requirePermission("settings.manage");
  const cs = await getCompanySettings();

  return (
    <AdminShell user={user} active="/admin/einstellungen">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Einstellungen</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>
        Rechtliche Angaben der Gesellschaft. Diese werden im Impressum und in generierten Dokumenten verwendet.
      </p>
      <PlaceholderBadge text="Firmierung, Register, USt-IdNr., Bankverbindung: durch die Compliance/Recht zu validieren, bevor sie öffentlich erscheinen." />

      <form action={updateSettingsAction} style={{ marginTop: "1.5rem", display: "grid", gap: "1.25rem", maxWidth: "820px" }}>
        <Card title="Unternehmensinformationen">
          <Field label="Name" name="legalName" value={cs.legalName} full />
          <Field label="Adresse" name="address" value={cs.address ?? ""} full />
          <Field label="Registernummer" name="registration" value={cs.registration ?? ""} />
          <Field label="USt-IdNr." name="vatId" value={cs.vatId ?? ""} />
          <Field label="Stammkapital" name="shareCapital" value={cs.shareCapital ?? ""} />
          <Field label="Gesetzliche Vertretung" name="representative" value={cs.representative ?? ""} />
          <Field label="E-Mail" name="email" type="email" value={cs.email ?? ""} />
          <Field label="Telefon" name="phone" value={cs.phone ?? ""} />
        </Card>

        <Card title="Bankverbindung">
          <Field label="Name der Bank" name="bankName" value={cs.bankName ?? ""} />
          <Field label="IBAN" name="iban" value={cs.iban ?? ""} />
          <Field label="BIC / SWIFT" name="bic" value={cs.bic ?? ""} />
        </Card>

        <div><button type="submit" className="sand-btn sand-btn-primary">Speichern</button></div>
      </form>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sand-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-sand-muted)", marginBottom: "1rem" }}>{title}</h2>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>{children}</div>
    </div>
  );
}

function Field({ label, name, value, type = "text", full }: { label: string; name: string; value: string; type?: string; full?: boolean }) {
  return (
    <label style={{ display: "grid", gap: "0.3rem", gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-sand-muted)" }}>{label}</span>
      <input className="sand-field" name={name} type={type} defaultValue={value} />
    </label>
  );
}
