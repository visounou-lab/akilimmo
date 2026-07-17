import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceholderBadge } from "@/components/ui";
import { publishVersionAction } from "../actions";

export default async function CreditProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const v = await prisma.creditProductVersion.findUnique({ where: { id } });
  if (!v) notFound();
  if (!can(user.role, "creditProducts.edit")) redirect("/admin/credit-products");

  const field = (label: string, name: string, value: string | number, step?: string) => (
    <label style={{ display: "grid", gap: "0.3rem" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{label}</span>
      <input className="sand-field" name={name} defaultValue={value} type="number" step={step ?? "any"} />
    </label>
  );

  return (
    <AdminShell user={user} active="/admin/credit-products">
      <Link href="/admin/credit-products" style={{ fontSize: "0.85rem", color: "var(--color-sand-cta)", textDecoration: "none" }}>← Kreditparameter</Link>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-sand-navy)", marginTop: "0.25rem" }}>
        {v.productType} · {v.country} — v{v.version}
      </h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>
        Beim Speichern wird <strong>Version {v.version + 1}</strong> veröffentlicht; Version {v.version} wird archiviert.
      </p>
      <PlaceholderBadge text="Nominalzins, Beträge und Fristen müssen vor Veröffentlichung rechtlich validiert werden." />

      <form action={publishVersionAction} className="sand-card" style={{ marginTop: "1.25rem", padding: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", maxWidth: "760px" }}>
        <input type="hidden" name="key" value={v.key} />
        {field("Mindestbetrag", "minAmount", v.minAmount)}
        {field("Höchstbetrag", "maxAmount", v.maxAmount)}
        {field("Min. Laufzeit (Monate)", "minTerm", v.minTerm, "1")}
        {field("Max. Laufzeit (Monate)", "maxTerm", v.maxTerm, "1")}
        {field("Nominalzins (dezimal, z. B. 0.069)", "nominalRate", v.nominalRate)}
        {field("Effektivzins (optional)", "effectiveRate", v.effectiveRate ?? "")}
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Gebührentyp</span>
          <select className="sand-field" name="originationFeeType" defaultValue={v.originationFeeType ?? ""}>
            <option value="">Keine</option>
            <option value="fixed">Fest</option>
            <option value="percent">Prozentual</option>
          </select>
        </label>
        {field("Gebührenwert", "originationFeeValue", v.originationFeeValue ?? "")}
        {field("Rundungseinheit", "roundingUnit", v.roundingUnit)}
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Rundung</span>
          <select className="sand-field" name="roundingMode" defaultValue={v.roundingMode}>
            <option value="nearest">Kaufmännisch</option>
            <option value="up">Aufrunden</option>
            <option value="down">Abrunden</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Gültig ab</span>
          <input className="sand-field" name="activeFrom" defaultValue={v.activeFrom} placeholder="2026-01-01" />
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Gültig bis (optional)</span>
          <input className="sand-field" name="activeTo" defaultValue={v.activeTo ?? ""} placeholder="—" />
        </label>
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="sand-btn sand-btn-primary">Neue Version veröffentlichen</button>
        </div>
      </form>
    </AdminShell>
  );
}
