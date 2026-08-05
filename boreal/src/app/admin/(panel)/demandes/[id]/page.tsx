import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/auth/rbac";
import {
  STATUS_LABELS,
  STATUS_BADGE,
  ALL_STATUSES,
  formatMoney,
  formatDate,
} from "@/lib/admin/status";
import { productLabel, countryLabel } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";
import { DeleteApplicationButton } from "@/components/admin/delete-application-button";
import {
  updateStatusAction,
  addNoteAction,
  assignAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("applications.view");
  const { id } = await params;

  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        include: { changedBy: { select: { name: true } } },
      },
    },
  });
  if (!app) notFound();

  const staff = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const salutation =
    app.salutation === "mr"
      ? "M."
      : app.salutation === "mrs"
        ? "Mme"
        : app.salutation === "other"
          ? "Autre"
          : "";

  return (
    <div className="space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <Link
          href="/admin/demandes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Demandes
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold">
            Dossier <span className="font-mono">{app.reference}</span>
          </h1>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              STATUS_BADGE[app.status],
            )}
          >
            {STATUS_LABELS[app.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Reçu le {formatDate(app.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main info */}
        <div className="space-y-6">
          <Card title="Projet">
            <InfoGrid
              items={[
                ["Produit", productLabel(app.product)],
                ["Pays", countryLabel(app.country)],
                ["Montant", formatMoney(app.amount, app.currency)],
                ["Durée", `${app.months} mois`],
                ["Taux indicatif", `${app.annualRate} %`],
                ["Mensualité", formatMoney(app.monthlyPayment, app.currency)],
                ["Coût total du crédit", formatMoney(app.totalCost, app.currency)],
                ["Objet", app.purpose || "—"],
              ]}
            />
          </Card>

          <Card title="Identité">
            <InfoGrid
              items={[
                ["Civilité", salutation || "—"],
                ["Prénom", app.firstName],
                ["Nom", app.lastName],
                ["Date de naissance", app.birthDate ? formatDate(app.birthDate) : "—"],
                ["Nationalité", app.nationality || "—"],
                ["N° national", app.nationalId || "—"],
                ["Adresse", app.addressLine || "—"],
                ["Code postal", app.postalCode || "—"],
                ["Ville", app.city || "—"],
                ["Téléphone", app.phone],
                ["Courriel", app.email],
              ]}
            />
          </Card>

          <Card title="Situation">
            <InfoGrid
              items={[
                ["Emploi / activité", app.occupation || "—"],
                ["Revenu net mensuel", formatMoney(app.monthlyIncome, app.currency)],
                ["Logement", app.housingSituation || "—"],
                ["Crédits en cours", app.existingCredits || "—"],
              ]}
            />
          </Card>

          <Card title="Consentements">
            <ul className="space-y-1.5 text-sm">
              <Consent ok={app.consentDataProcessing} label="Traitement des données" />
              <Consent ok={app.consentAccuracy} label="Exactitude des informations" />
              <Consent ok={app.consentContact} label="Accepte d'être contacté·e" />
              <Consent ok={app.consentMarketing} label="Communications marketing (optionnel)" />
            </ul>
          </Card>

          {/* Historique */}
          <Card title="Historique des statuts">
            {app.statusHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun changement enregistré.</p>
            ) : (
              <ol className="space-y-3">
                {app.statusHistory.map((h) => (
                  <li key={h.id} className="flex gap-3 text-sm">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-glacier" />
                    <div>
                      <div>
                        {h.fromStatus ? `${STATUS_LABELS[h.fromStatus]} → ` : ""}
                        <span className="font-medium">{STATUS_LABELS[h.toStatus]}</span>
                      </div>
                      {h.reason && (
                        <div className="text-muted-foreground">Motif : {h.reason}</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDate(h.createdAt)}
                        {h.changedBy ? ` · ${h.changedBy.name}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-6">
          {can(user.role, "applications.updateStatus") && (
            <Card title="Changer le statut">
              <form action={updateStatusAction} className="space-y-3">
                <input type="hidden" name="id" value={app.id} />
                <select
                  name="status"
                  defaultValue={app.status}
                  className="h-10 w-full rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <textarea
                  name="reason"
                  rows={2}
                  placeholder="Motif (facultatif)"
                  className="w-full rounded-md border bg-background/60 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Mettre à jour
                </button>
              </form>
            </Card>
          )}

          {can(user.role, "applications.assign") && (
            <Card title="Chargé·e du dossier">
              <form action={assignAction} className="space-y-3">
                <input type="hidden" name="id" value={app.id} />
                <select
                  name="assignedToId"
                  defaultValue={app.assignedToId ?? ""}
                  className="h-10 w-full rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Non assigné</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Assigner
                </button>
              </form>
            </Card>
          )}

          <Card title="Documents">
            <p className="text-sm text-muted-foreground">
              Génération de documents (brouillons vérifiables « BROUILLON — non
              contractuel » avec QR de vérification) — à venir.
            </p>
            <button
              type="button"
              disabled
              className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground opacity-60"
            >
              <FileText className="size-4" />
              Générer un document
            </button>
          </Card>

          {can(user.role, "applications.delete") && (
            <Card title="Zone sensible">
              <p className="mb-3 text-sm text-muted-foreground">
                La suppression d'un dossier est définitive.
              </p>
              <DeleteApplicationButton id={app.id} variant="full" />
            </Card>
          )}
        </div>
      </div>

      {/* Notes internes */}
      {can(user.role, "applications.note") && (
        <Card title="Notes internes">
          <form action={addNoteAction} className="space-y-3">
            <input type="hidden" name="id" value={app.id} />
            <textarea
              name="body"
              rows={3}
              placeholder="Ajouter une note interne…"
              className="w-full rounded-md border bg-background/60 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ajouter la note
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {app.notes.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune note pour l'instant.</p>
            )}
            {app.notes.map((n) => (
              <div key={n.id} className="rounded-lg border bg-secondary/30 p-3 text-sm">
                <p className="whitespace-pre-wrap">{n.body}</p>
                <div className="mt-1.5 text-xs text-muted-foreground">
                  {n.author?.name ?? "—"} · {formatDate(n.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <h2 className="mb-4 font-serif text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="mt-0.5 text-sm font-medium break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Consent({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn("size-2 rounded-full", ok ? "bg-emerald-500" : "bg-muted-foreground/40")} />
      <span className={ok ? "" : "text-muted-foreground"}>{label}</span>
      <span className="ml-auto text-xs text-muted-foreground">{ok ? "Oui" : "Non"}</span>
    </li>
  );
}
