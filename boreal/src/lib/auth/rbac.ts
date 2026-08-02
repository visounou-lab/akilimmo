import type { Role } from "@prisma/client";

export type Permission =
  | "dashboard.view"
  | "applications.view"
  | "applications.updateStatus"
  | "applications.assign"
  | "applications.note"
  | "applications.delete"
  | "applications.export"
  | "documents.generate"
  | "audit.view"
  | "users.manage"
  | "products.manage"
  | "settings.manage";

export const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "applications.view",
  "applications.updateStatus",
  "applications.assign",
  "applications.note",
  "applications.delete",
  "applications.export",
  "documents.generate",
  "audit.view",
  "users.manage",
  "products.manage",
  "settings.manage",
];

/** Permission matrix per role (Super Admin holds everything). */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  COMPLIANCE: [
    "dashboard.view",
    "applications.view",
    "applications.updateStatus",
    "applications.note",
    "applications.export",
    "documents.generate",
    "audit.view",
    "settings.manage",
  ],
  FINANCIAL_ANALYST: [
    "dashboard.view",
    "applications.view",
    "applications.updateStatus",
    "applications.assign",
    "applications.note",
    "applications.export",
  ],
  CASE_MANAGER: [
    "dashboard.view",
    "applications.view",
    "applications.updateStatus",
    "applications.assign",
    "applications.note",
    "applications.export",
    "documents.generate",
  ],
  DOCUMENT_MANAGER: [
    "dashboard.view",
    "applications.view",
    "applications.note",
    "documents.generate",
  ],
  CUSTOMER_SUPPORT: [
    "dashboard.view",
    "applications.view",
    "applications.note",
  ],
  AUDITOR: [
    "dashboard.view",
    "applications.view",
    "applications.export",
    "audit.view",
  ],
  READ_ONLY: ["dashboard.view", "applications.view"],
};

/** Labels FR pour l'écran Accès (langue unique du back-office). */
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super administrateur",
  COMPLIANCE: "Conformité",
  FINANCIAL_ANALYST: "Analyste financier",
  CASE_MANAGER: "Gestionnaire de dossier",
  DOCUMENT_MANAGER: "Gestionnaire de documents",
  CUSTOMER_SUPPORT: "Support client",
  AUDITOR: "Auditeur",
  READ_ONLY: "Lecture seule",
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
