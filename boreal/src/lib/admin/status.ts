import type { ApplicationStatus } from "@prisma/client";

/** French labels for every application status (back-office is French-only). */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "En attente",
  UNDER_REVIEW: "En cours d'analyse",
  DOCUMENTS_REQUESTED: "Pièces demandées",
  PROPOSAL_SENT: "Proposition envoyée",
  APPROVED: "Approuvée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
  CLOSED: "Clôturée",
};

/** Tailwind classes for each status badge. */
export const STATUS_BADGE: Record<ApplicationStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  UNDER_REVIEW: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  DOCUMENTS_REQUESTED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
  PROPOSAL_SENT:
    "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  CANCELLED: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300",
  CLOSED: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300",
};

export const ALL_STATUSES: ApplicationStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUESTED",
  "PROPOSAL_SENT",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "CLOSED",
];

/** Status tabs used on the list screen, mapped to the underlying statuses. */
export const STATUS_TABS: {
  key: string;
  label: string;
  statuses: ApplicationStatus[] | null;
}[] = [
  { key: "all", label: "Toutes", statuses: null },
  { key: "pending", label: "En attente", statuses: ["SUBMITTED"] },
  {
    key: "processing",
    label: "En cours",
    statuses: ["UNDER_REVIEW", "DOCUMENTS_REQUESTED", "PROPOSAL_SENT"],
  },
  { key: "approved", label: "Approuvées", statuses: ["APPROVED"] },
  { key: "rejected", label: "Refusées", statuses: ["REJECTED"] },
];

export function tabToStatuses(key: string): ApplicationStatus[] | null {
  return STATUS_TABS.find((t) => t.key === key)?.statuses ?? null;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
