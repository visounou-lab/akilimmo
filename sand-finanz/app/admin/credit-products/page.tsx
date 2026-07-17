import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceholderBadge } from "@/components/ui";
import { formatPercent } from "@/lib/credit-engine";

export default async function CreditProductsPage() {
  const user = await requireUser();
  const versions = await prisma.creditProductVersion.findMany({
    orderBy: [{ key: "asc" }, { version: "desc" }],
  });

  return (
    <AdminShell user={user} active="/admin/credit-products">
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-sand-navy)" }}>Kreditparameter</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>
        Versionierte Parameter — Quelle für Rechner und Angebote. Neue Werte erzeugen eine neue Version;
        alte Versionen bleiben unveränderlich.
      </p>
      <PlaceholderBadge text="Beispielwerte — vor Veröffentlichung durch die Compliance zu validieren." />

      <div className="sand-card" style={{ marginTop: "1.25rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "760px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-sand-muted)" }}>
              <th style={{ padding: "0.7rem 1rem" }}>Produkt</th>
              <th style={{ padding: "0.7rem 1rem" }}>Ver.</th>
              <th style={{ padding: "0.7rem 1rem" }}>Land</th>
              <th style={{ padding: "0.7rem 1rem" }}>Betrag</th>
              <th style={{ padding: "0.7rem 1rem" }}>Laufzeit</th>
              <th style={{ padding: "0.7rem 1rem" }}>Nominalzins</th>
              <th style={{ padding: "0.7rem 1rem" }}>Status</th>
              <th style={{ padding: "0.7rem 1rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.id} style={{ borderTop: "1px solid var(--color-sand-border)", opacity: v.status === "ARCHIVED" ? 0.55 : 1 }}>
                <td style={{ padding: "0.7rem 1rem", fontWeight: 600 }}>{v.productType}</td>
                <td style={{ padding: "0.7rem 1rem" }}>v{v.version}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{v.country}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{v.minAmount}–{v.maxAmount} {v.currency}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{v.minTerm}–{v.maxTerm} M.</td>
                <td style={{ padding: "0.7rem 1rem" }}>{formatPercent(v.nominalRate, "de-DE")}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{v.status}</td>
                <td style={{ padding: "0.7rem 1rem" }}>
                  {v.status === "PUBLISHED" && (
                    <Link href={`/admin/credit-products/${v.id}`} style={{ color: "var(--color-sand-cta)", fontWeight: 600, textDecoration: "none" }}>Bearbeiten</Link>
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
