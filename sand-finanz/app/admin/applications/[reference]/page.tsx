import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/application-status";
import { formatMoney, formatPercent } from "@/lib/credit-engine";
import {
  addNoteAction,
  assignToMeAction,
  changeStatusAction,
  createOfferAction,
} from "../actions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const user = await requireUser();

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

  const money = (n: number) => formatMoney(n, app.currency, "de-DE");
  const c = app.customer;

  return (
    <AdminShell user={user} active="/admin/applications">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Link href="/admin/applications" style={{ fontSize: "0.85rem", color: "var(--color-sand-cta)", textDecoration: "none" }}>← Anträge</Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-sand-navy)", marginTop: "0.25rem" }}>{app.reference}</h1>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {/* Project */}
        <Card title="Vorhaben">
          <Row k="Produkt" v={app.productType} />
          <Row k="Land" v={app.country} />
          <Row k="Betrag" v={money(app.amount)} />
          <Row k="Laufzeit" v={`${app.termMonths} Monate`} />
          <Row k="Zweck" v={app.purpose || "—"} />
          <Row k="Erstellt" v={new Date(app.createdAt).toLocaleString("de-DE")} />
        </Card>

        {/* Customer */}
        <Card title="Kunde">
          <Row k="Name" v={`${c.salutation ?? ""} ${c.firstName} ${c.lastName}`.trim()} />
          <Row k="E-Mail" v={c.email} />
          <Row k="Telefon" v={c.phone || "—"} />
          <Row k="Geburtsdatum" v={c.birthDate || "—"} />
          <Row k="Staatsangeh." v={c.nationality || "—"} />
          <Row k="Anschrift" v={c.address || "—"} />
        </Card>

        {/* Financials */}
        <Card title="Finanzielle Situation">
          <Row k="Beschäftigung" v={app.financialProfile?.employment || "—"} />
          <Row k="Einkommen" v={app.financialProfile?.income != null ? money(app.financialProfile.income) : "—"} />
          <Row k="Ausgaben" v={app.financialProfile?.expenses != null ? money(app.financialProfile.expenses) : "—"} />
          <Row k="Wohnsituation" v={app.financialProfile?.housing || "—"} />
          <Row k="Bestehende Kredite" v={app.financialProfile?.existingLoans || "—"} />
        </Card>

        {/* Consents */}
        <Card title="Einwilligungen">
          <Row k="Datenschutz" v={fmtDate(c.consentPrivacyAt)} />
          <Row k="Kontakt" v={fmtDate(c.consentContactAt)} />
          <Row k="Marketing" v={fmtDate(c.consentMarketingAt)} />
          <Row k="Zugewiesen an" v={app.assignedTo?.name ?? "—"} />
        </Card>
      </div>

      {/* Workflow */}
      <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {can(user.role, "applications.changeStatus") && (
          <form action={changeStatusAction} className="sand-card" style={{ padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "end", flexWrap: "wrap" }}>
            <input type="hidden" name="reference" value={app.reference} />
            <label style={{ display: "grid", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Status ändern</span>
              <select key={app.status} className="sand-field" name="status" defaultValue={app.status}>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </label>
            <button type="submit" className="sand-btn sand-btn-primary">Speichern</button>
          </form>
        )}
        {can(user.role, "applications.assign") && (
          <form action={assignToMeAction} className="sand-card" style={{ padding: "1rem", display: "flex", alignItems: "center" }}>
            <input type="hidden" name="reference" value={app.reference} />
            <button type="submit" className="sand-btn sand-btn-ghost">Mir zuweisen</button>
          </form>
        )}
        {can(user.role, "applications.createOffer") && (
          <form action={createOfferAction} className="sand-card" style={{ padding: "1rem", display: "flex", alignItems: "center" }}>
            <input type="hidden" name="reference" value={app.reference} />
            <button type="submit" className="sand-btn sand-btn-ghost">Angebot erstellen</button>
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
        {app.notes.map((n) => (
          <li key={n.id} className="sand-card" style={{ padding: "0.9rem 1.1rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--color-sand-muted)" }}>
              {n.author.name} · {new Date(n.createdAt).toLocaleString("de-DE")}
            </div>
            <div style={{ marginTop: "0.35rem", whiteSpace: "pre-wrap" }}>{n.body}</div>
          </li>
        ))}
        {app.notes.length === 0 && <li style={{ color: "var(--color-sand-muted)" }}>Noch keine Notizen.</li>}
      </ul>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sand-card" style={{ padding: "1.25rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-sand-navy)", marginBottom: "0.75rem" }}>{title}</h2>
      <dl style={{ display: "grid", gap: "0.4rem", margin: 0 }}>{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.9rem" }}>
      <dt style={{ color: "var(--color-sand-muted)" }}>{k}</dt>
      <dd style={{ margin: 0, fontWeight: 500, textAlign: "right" }}>{v}</dd>
    </div>
  );
}

function fmtDate(d: Date | null): string {
  return d ? new Date(d).toLocaleString("de-DE") : "—";
}
