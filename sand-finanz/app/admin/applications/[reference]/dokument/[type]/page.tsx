import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceholderBadge } from "@/components/ui";
import { localeConfig, isRouteLocale } from "@/lib/i18n/config";

const LABELS: Record<string, string> = {
  anmeldeformular: "Anmeldeformular",
  tilgungsplan: "Tilgungsplan",
  vertrag: "Kreditvertrag",
  einlagenzertifikat: "Einlagenzertifikat",
};

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ reference: string; type: string }>;
}) {
  const { reference, type } = await params;
  const user = await requirePermission("documents.generate");
  const label = LABELS[type];
  if (!label) notFound();

  const app = await prisma.application.findUnique({ where: { reference }, include: { customer: true } });
  if (!app) notFound();
  const custLocale = isRouteLocale(app.customer.locale) ? app.customer.locale : "de";

  return (
    <AdminShell user={user} active="/admin/applications">
      <Link href={`/admin/applications/${reference}`} style={{ fontSize: "0.85rem", color: "var(--color-sand-cta)", textDecoration: "none" }}>← Dossier {reference}</Link>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-sand-navy)", marginTop: "0.25rem" }}>{label}</h1>
      <p style={{ color: "var(--color-sand-muted)", marginTop: "0.25rem" }}>
        Kunde: {app.customer.firstName} {app.customer.lastName} · Sprache: <strong>{localeConfig[custLocale].label}</strong>
      </p>

      <PlaceholderBadge text="PDF-Generierung folgt im nächsten Schritt (Gabarits A4, en-tête/pied de page, versionierung, SHA-256, stockage privé)." />

      <div className="sand-card" style={{ marginTop: "1.5rem", padding: "1.5rem", maxWidth: "640px" }}>
        <p style={{ color: "var(--color-sand-muted)" }}>
          Dieses Dokument wird als versioniertes A4-PDF in der Sprache des Kunden erzeugt und
          privat gespeichert. Die Generierung wird im PDF-Lot implementiert; die Struktur und die
          Daten stehen bereits bereit.
        </p>
      </div>
    </AdminShell>
  );
}
