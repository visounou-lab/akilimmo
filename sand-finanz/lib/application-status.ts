import type { ApplicationStatus } from "@prisma/client";

export const ALL_STATUSES: ApplicationStatus[] = [
  "DRAFT", "SUBMITTED", "DOCUMENTS_PENDING", "UNDER_REVIEW", "OFFER_PREPARED",
  "APPROVED", "DECLINED", "CONTRACT_SENT", "SIGNED", "DISBURSEMENT_PENDING",
  "COMPLETED", "CANCELLED", "EXPIRED", "ON_HOLD", "FRAUD_REVIEW",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Entwurf",
  SUBMITTED: "Eingereicht",
  DOCUMENTS_PENDING: "Unterlagen ausstehend",
  UNDER_REVIEW: "In Prüfung",
  OFFER_PREPARED: "Angebot erstellt",
  APPROVED: "Genehmigt",
  DECLINED: "Abgelehnt",
  CONTRACT_SENT: "Vertrag versendet",
  SIGNED: "Unterschrieben",
  DISBURSEMENT_PENDING: "Auszahlung ausstehend",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
  EXPIRED: "Abgelaufen",
  ON_HOLD: "Pausiert",
  FRAUD_REVIEW: "Betrugsprüfung",
};
