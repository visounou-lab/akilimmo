import Link from "next/link";
import {
  FileStack,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
} from "lucide-react";

import { requirePermission } from "@/lib/auth/guards";
import { getDashboardData } from "@/lib/admin/queries";
import { STATUS_LABELS, STATUS_BADGE, formatMoney, formatDate } from "@/lib/admin/status";
import { productLabel, countryLabel } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requirePermission("dashboard.view");
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d'ensemble des demandes de financement.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={FileStack} label="Total des demandes" value={data.total} />
        <Kpi icon={Clock} label="En attente" value={data.pending} tone="amber" />
        <Kpi icon={CheckCircle2} label="Approuvées" value={data.approved} tone="emerald" />
        <Kpi icon={XCircle} label="Refusées" value={data.rejected} tone="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Portfolio multi-devises */}
        <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-glacier" />
            <h2 className="font-serif text-lg font-semibold">
              Portefeuille par devise
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Montants demandés, jamais convertis ni additionnés entre devises.
          </p>
          <div className="mt-4 divide-y">
            {data.portfolio.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                Aucune demande pour le moment.
              </p>
            )}
            {data.portfolio.map((b) => (
              <div key={b.currency} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{b.currency}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.count} demande{b.count > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="font-serif text-lg font-semibold tabular-nums">
                  {formatMoney(b.total, b.currency)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Taux d'approbation + répartitions */}
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-lg font-semibold">Taux d'approbation</h2>
            <div className="mt-2 font-serif text-4xl font-semibold">
              {data.approvalRate === null ? "—" : `${data.approvalRate} %`}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sur les dossiers décidés (approuvés + refusés).
            </p>
          </section>

          <Distribution title="Par produit" items={data.byProduct} labeler={productLabel} />
          <Distribution title="Par pays" items={data.byCountry} labeler={countryLabel} />
        </div>
      </div>

      {/* Activité récente */}
      <section className="rounded-xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-serif text-lg font-semibold">Activité récente</h2>
          <Link href="/admin/demandes" className="text-sm font-medium text-primary hover:underline">
            Voir toutes les demandes
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="px-6 py-3 font-medium">Dossier</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 text-right font-medium">Montant</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Aucune demande enregistrée.
                  </td>
                </tr>
              )}
              {data.recent.map((a) => (
                <tr key={a.id} className="hover:bg-muted/40">
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/demandes/${a.id}`}
                      className="font-mono text-xs font-medium text-primary hover:underline"
                    >
                      {a.reference}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums">
                    {formatMoney(a.amount, a.currency)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        STATUS_BADGE[a.status],
                      )}
                    >
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof FileStack;
  label: string;
  value: number;
  tone?: "default" | "amber" | "emerald" | "red";
}) {
  const tones = {
    default: "bg-accent text-primary",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    emerald:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
      <span className={cn("inline-flex size-10 items-center justify-center rounded-lg", tones[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="mt-4 font-serif text-3xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Distribution({
  title,
  items,
  labeler,
}: {
  title: string;
  items: { key: string; count: number }[];
  labeler: (key: string) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <h2 className="font-serif text-sm font-semibold">{title}</h2>
      <div className="mt-4 space-y-2.5">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">—</p>
        )}
        {items.map((i) => (
          <div key={i.key} className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 truncate text-muted-foreground">
              {labeler(i.key)}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-glacier"
                style={{ width: `${(i.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right tabular-nums">{i.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
