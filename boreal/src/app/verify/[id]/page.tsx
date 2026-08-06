import { ShieldCheck, ShieldX, FileText } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { DOCUMENT_LABELS } from "@/lib/documents";
import { BorealMark } from "@/components/layout/logo";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await prisma.document
    .findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        version: true,
        sha256: true,
        isDraft: true,
        createdAt: true,
        application: { select: { reference: true } },
      },
    })
    .catch(() => null);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <BorealMark />
          <span className="font-serif text-lg font-semibold">Boreal Finance</span>
        </div>

        {!doc ? (
          <Panel
            tone="error"
            icon={<ShieldX className="size-7" />}
            title="Document introuvable"
            subtitle="Aucun document ne correspond à cet identifiant de vérification."
          />
        ) : (
          <Panel
            tone="ok"
            icon={<ShieldCheck className="size-7" />}
            title="Document authentifié"
            subtitle="Ce document est un brouillon enregistré et vérifiable."
          >
            <dl className="mt-6 space-y-3 border-t pt-5 text-sm">
              <Row label="Type de document" value={DOCUMENT_LABELS[doc.type]} />
              <Row label="Dossier" value={doc.application.reference} mono />
              <Row label="Version" value={`v${doc.version}`} />
              <Row label="Généré le" value={formatDateTime(doc.createdAt)} />
              <Row label="Empreinte SHA-256" value={doc.sha256} mono wrap />
            </dl>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <FileText className="mt-0.5 size-4 shrink-0" />
              <p>
                <strong>Brouillon — non contractuel.</strong> Ce document ne
                constitue ni une offre de crédit, ni un engagement, ni une preuve
                de fonds ou de dépôt. Environnement de démonstration.
              </p>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({
  tone,
  icon,
  title,
  subtitle,
  children,
}: {
  tone: "ok" | "error";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span
          className={
            tone === "ok"
              ? "inline-flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
          }
        >
          {icon}
        </span>
        <h1 className="mt-4 font-serif text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  wrap,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wrap?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={`text-right font-medium ${mono ? "font-mono text-xs" : ""} ${wrap ? "break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
