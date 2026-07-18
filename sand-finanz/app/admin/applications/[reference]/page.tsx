import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/application-status";
import { formatMoney, formatPercent } from "@/lib/credit-engine";
import { localeConfig, isRouteLocale } from "@/lib/i18n/config";
import {
  addNoteAction,
  assignToMeAction,
  createOfferAction,
  deleteApplicationAction,
  updateApplicationAction,
} from "../actions";

const DOCUMENTS = [
  { type: "anmeldeformular", label: "Anmeldeformular", color: "#7c3aed" },
  { type: "tilgungsplan", label: "Tilgungsplan", color: "#ea6a12" },
  { type: "vertrag", label: "Vertrag erstellen", color: "#2666eb" },
  { type: "einlagenzertifikat", label: "Einlagenzertifikat", color: "#15803d" },
] as const;

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const user = await requireUser();
  const canEdit = can(user.role, "applications.edit");
  const canDelete = can(user.role, "applications.delete");
  const canDocs = can(user.role, "documents.generate");

  const app = await prisma.application.findUnique({
    where: { reference },
    include: {
      customer: true,
      financialProfile: true,
      assignedTo: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
      offers: { orderBy: { createdAt: "desc" }, include: { productVersion: true } },
    },
  });
  if (!app) notFound();

  const c = app.customer;
  const money = (n: number) => formatMoney(n, app.currency, "de-DE");
  const custLocale = isRouteLocale(c.locale) ? c.locale : "de";
  const langLabel = localeConfig[custLocale].label;

  return (
    <AdminShell user={user} active="/admin/applications">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ fontSize: "0.9rem", color: "var(--color-sand-muted)" }}>
          <Link href="/admin/applications" style={{ color: "var(--color-sand-cta)", textDecoration: "none" }}>← Anträge</Link>
          {" / "}
          <strong style={{ color: "var(--color-sand-navy)" }}>Dossier {app.reference}</strong>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Document generation bar */}
      {canDocs && (
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {DOCUMENTS.map((d) => (
              // eslint-disable-next-line @next/next/no-html-link-for-pages -- PDF stream route, opens in a new tab
              <a
                key={d.type}
                href={`/admin/applications/${app.reference}/dokument/${d.type}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sand-btn"
                style={{ background: d.color, color: "#fff" }}
              >
                📄 {d.label}
              </a>
            ))}
          </div>
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-sand-muted)" }}>
            Dokumente werden in der Sprache des Kunden generiert:{" "}
            <strong style={{ color: "var(--color-sand-navy)" }}>{langLabel}</strong>
          </p>
        </div>
      )}

      {/* Editable dossier */}
      <form action={updateApplicationAction} style={{ marginTop: "1.5rem", display: "grid", gap: "1.25rem" }}>
        <input type="hidden" name="reference" value={app.reference} />

        <FormCard title="Persönliche Informationen">
          <Field label="Vorname" name="firstName" defaultValue={c.firstName} disabled={!canEdit} />
          <Field label="Nachname" name="lastName" defaultValue={c.lastName} disabled={!canEdit} />
          <Field label="E-Mail" name="email" type="email" defaultValue={c.email} disabled={!canEdit} />
          <Field label="Telefon" name="phone" defaultValue={c.phone ?? ""} disabled={!canEdit} />
          <Field label="Geburtsdatum" name="birthDate" type="date" defaultValue={c.birthDate ?? ""} disabled={!canEdit} />
          <Field label="Beruf" name="occupation" defaultValue={c.occupation ?? ""} disabled={!canEdit} />
          <Field label="Adresse" name="address" defaultValue={c.address ?? ""} disabled={!canEdit} />
          <Field label="PLZ" name="postalCode" defaultValue={c.postalCode ?? ""} disabled={!canEdit} />
          <Field label="Stadt" name="city" defaultValue={c.city ?? ""} disabled={!canEdit} />
          <Field label="Monatseinkommen (€)" name="income" type="number" defaultValue={app.financialProfile?.income ?? ""} disabled={!canEdit} />
        </FormCard>

        <FormCard title="Kreditantrag">
          <Field label="Beantragter Betrag (€)" name="amount" type="number" defaultValue={app.amount} disabled={!canEdit} />
          <Field label="Laufzeit (Monate)" name="termMonths" type="number" defaultValue={app.termMonths} disabled={!canEdit} />
          <Field label="Versicherungsbetrag (€)" name="insuranceAmount" type="number" defaultValue={app.insuranceAmount ?? ""} disabled={!canEdit} />
          <Field label="Projektbeschreibung" name="purpose" defaultValue={app.purpose ?? ""} disabled={!canEdit} textarea full />
        </FormCard>

        <FormCard title="Bankverbindung">
          <Field label="Name der Bank" name="bankName" defaultValue={app.bankName ?? ""} disabled={!canEdit} />
          <Field label="IBAN" name="iban" defaultValue={app.iban ?? ""} disabled={!canEdit} />
          <Field label="BIC / SWIFT" name="bic" defaultValue={app.bic ?? ""} disabled={!canEdit} />
          <Field label="Zahlungsbeginn" name="paymentStartDate" type="date" defaultValue={app.paymentStartDate ?? ""} disabled={!canEdit} />
          <Field label="Überweisungsdatum" name="transferDate" type="date" defaultValue={app.transferDate ?? ""} disabled={!canEdit} />
        </FormCard>

        <FormCard title="Antragsstatus">
          <label style={{ display: "grid", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Status</span>
            <select key={app.status} className="sand-field" name="status" defaultValue={app.status} disabled={!canEdit}>
              {ALL_STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
            </select>
          </label>
        </FormCard>

        {canEdit && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="sand-btn sand-btn-primary">Speichern</button>
          </div>
        )}
      </form>

      {/* Secondary actions */}
      <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {can(user.role, "applications.assign") && (
          <form action={assignToMeAction}>
            <input type="hidden" name="reference" value={app.reference} />
            <button type="submit" className="sand-btn sand-btn-ghost">Mir zuweisen{app.assignedTo ? ` (aktuell: ${app.assignedTo.name})` : ""}</button>
          </form>
        )}
        {can(user.role, "applications.createOffer") && (
          <form action={createOfferAction}>
            <input type="hidden" name="reference" value={app.reference} />
            <button type="submit" className="sand-btn sand-btn-ghost">Angebot erstellen</button>
          </form>
        )}
        {canDelete && (
          <form action={deleteApplicationAction}>
            <input type="hidden" name="reference" value={app.reference} />
            <button type="submit" className="sand-btn" style={{ background: "#dc2626", color: "#fff" }}>Antrag löschen</button>
          </form>
        )}
      </div>

      {/* Offers */}
      <h2 style={{ marginTop: "1.75rem", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>Angebote</h2>
      {app.offers.length === 0 ? (
        <p style={{ color: "var(--color-sand-muted)", marginTop: "0.5rem" }}>Noch kein Angebot erstellt.</p>
      ) : (
        <div className="sand-card" style={{ marginTop: "0.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "620px" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
                <th style={{ padding: "0.6rem 0.9rem" }}>Datum</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Betrag</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Laufzeit</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Rate</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Eff. Zins</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Gesamtkosten</th>
                <th style={{ padding: "0.6rem 0.9rem" }}>Version</th>
              </tr>
            </thead>
            <tbody>
              {app.offers.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--color-sand-border)" }}>
                  <td style={{ padding: "0.6rem 0.9rem" }}>{new Date(o.createdAt).toLocaleDateString("de-DE")}</td>
                  <td style={{ padding: "0.6rem 0.9rem" }}>{money(o.principal)}</td>
                  <td style={{ padding: "0.6rem 0.9rem" }}>{o.termMonths} M.</td>
                  <td style={{ padding: "0.6rem 0.9rem", fontWeight: 700 }}>{money(o.monthlyPayment)}</td>
                  <td style={{ padding: "0.6rem 0.9rem" }}>{formatPercent(o.effectiveRate, "de-DE")}</td>
                  <td style={{ padding: "0.6rem 0.9rem" }}>{money(o.totalCost)}</td>
                  <td style={{ padding: "0.6rem 0.9rem", color: "var(--color-sand-muted)" }}>{o.productVersion.key} v{o.productVersion.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      <h2 style={{ marginTop: "1.75rem", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)" }}>Notizen</h2>
      {can(user.role, "applications.addNote") && (
        <form action={addNoteAction} style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem", maxWidth: "620px" }}>
          <input type="hidden" name="reference" value={app.reference} />
          <textarea className="sand-field" name="body" rows={2} placeholder="Notiz hinzufügen…" required />
          <div><button type="submit" className="sand-btn sand-btn-primary">Notiz speichern</button></div>
        </form>
      )}
      <ul style={{ marginTop: "1rem", display: "grid", gap: "0.6rem", listStyle: "none", padding: 0, maxWidth: "720px" }}>
        {app.notes.map((no) => (
          <li key={no.id} className="sand-card" style={{ padding: "0.9rem 1.1rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--color-sand-muted)" }}>{no.author.name} · {new Date(no.createdAt).toLocaleString("de-DE")}</div>
            <div style={{ marginTop: "0.35rem", whiteSpace: "pre-wrap" }}>{no.body}</div>
          </li>
        ))}
        {app.notes.length === 0 && <li style={{ color: "var(--color-sand-muted)" }}>Noch keine Notizen.</li>}
      </ul>
    </AdminShell>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sand-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-sand-muted)", marginBottom: "1rem" }}>{title}</h2>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>{children}</div>
    </div>
  );
}

function Field({
  label, name, defaultValue, type = "text", disabled, textarea, full,
}: {
  label: string; name: string; defaultValue: string | number; type?: string; disabled?: boolean; textarea?: boolean; full?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: "0.3rem", gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-sand-muted)" }}>{label}</span>
      {textarea ? (
        <textarea className="sand-field" name={name} defaultValue={defaultValue} rows={3} disabled={disabled} />
      ) : (
        <input className="sand-field" name={name} type={type} defaultValue={defaultValue} disabled={disabled} />
      )}
    </label>
  );
}
