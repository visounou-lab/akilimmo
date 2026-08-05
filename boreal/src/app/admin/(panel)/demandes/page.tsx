import Link from "next/link";
import { Download, Search, Pencil } from "lucide-react";

import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/auth/rbac";
import { listApplications } from "@/lib/admin/queries";
import { STATUS_TABS, STATUS_LABELS, STATUS_BADGE, formatMoney, formatDate } from "@/lib/admin/status";
import { productLabel, countryLabel, PRODUCT_LABELS, COUNTRY_LABELS } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";
import { DeleteApplicationButton } from "@/components/admin/delete-application-button";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePermission("applications.view");
  const sp = await searchParams;
  const tab = sp.tab ?? "all";
  const filters = {
    tab,
    q: sp.q ?? "",
    country: sp.country ?? "",
    product: sp.product ?? "",
    sort: sp.sort ?? "recent",
  };

  const rows = await listApplications(filters);
  const canExport = can(user.role, "applications.export");
  const canDelete = can(user.role, "applications.delete");

  const csvQuery = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v),
  ).toString();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Demandes de financement</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} dossier{rows.length > 1 ? "s" : ""} affiché
            {rows.length > 1 ? "s" : ""}.
          </p>
        </div>
        {canExport && (
          <Link
            href={`/admin/csv${csvQuery ? `?${csvQuery}` : ""}`}
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
            prefetch={false}
          >
            <Download className="size-4" />
            Exporter CSV
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/demandes?tab=${t.key}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Filters */}
      <form className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
        <input type="hidden" name="tab" value={tab} />
        <div className="min-w-56 flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Nom, courriel ou référence"
              className="h-10 w-full rounded-md border bg-background/60 pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </div>
        <FilterSelect name="country" label="Pays" value={filters.country} options={COUNTRY_LABELS} />
        <FilterSelect name="product" label="Produit" value={filters.product} options={PRODUCT_LABELS} />
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Tri</label>
          <select
            name="sort"
            defaultValue={filters.sort}
            className="h-10 rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="recent">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="amount">Montant décroissant</option>
            <option value="amount_asc">Montant croissant</option>
          </select>
        </div>
        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Filtrer
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium">Dossier</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Courriel</th>
              <th className="px-4 py-3 text-right font-medium">Montant</th>
              <th className="px-4 py-3 text-right font-medium">Mensualité</th>
              <th className="px-4 py-3 font-medium">Chargé·e</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                  Aucun dossier ne correspond à ces critères.
                </td>
              </tr>
            )}
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/demandes/${a.id}`}
                    className="font-mono text-xs font-medium text-primary hover:underline"
                  >
                    {a.reference}
                  </Link>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {productLabel(a.product)} · {countryLabel(a.country)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {a.firstName} {a.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {formatMoney(a.amount, a.currency)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                  {formatMoney(a.monthlyPayment, a.currency)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {a.assignedTo?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                      STATUS_BADGE[a.status],
                    )}
                  >
                    {STATUS_LABELS[a.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(a.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/demandes/${a.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
                    >
                      <Pencil className="size-3.5" />
                      Ouvrir
                    </Link>
                    {canDelete && <DeleteApplicationButton id={a.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <select
        name={name}
        defaultValue={value}
        className="h-10 rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <option value="">Tous</option>
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
