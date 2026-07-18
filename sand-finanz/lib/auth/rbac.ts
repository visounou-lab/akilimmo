import type { Role } from "@prisma/client";

/**
 * Role-based permissions. Kept small and explicit so pages/actions can gate on a
 * capability rather than hard-coding role checks everywhere.
 */
export type Permission =
  | "applications.view"
  | "applications.assign"
  | "applications.changeStatus"
  | "applications.edit"
  | "applications.delete"
  | "applications.addNote"
  | "applications.createOffer"
  | "documents.generate"
  | "creditProducts.view"
  | "creditProducts.edit"
  | "settings.manage"
  | "audit.view"
  | "users.manage";

const MATRIX: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "applications.view",
    "applications.assign",
    "applications.changeStatus",
    "applications.edit",
    "applications.delete",
    "applications.addNote",
    "applications.createOffer",
    "documents.generate",
    "creditProducts.view",
    "creditProducts.edit",
    "settings.manage",
    "audit.view",
    "users.manage",
  ],
  ANALYST: [
    "applications.view",
    "applications.assign",
    "applications.changeStatus",
    "applications.edit",
    "applications.addNote",
    "applications.createOffer",
    "documents.generate",
    "creditProducts.view",
    "audit.view",
  ],
  ADVISOR: ["applications.view", "applications.edit", "applications.addNote", "documents.generate", "creditProducts.view"],
  READ_ONLY: ["applications.view", "creditProducts.view", "audit.view"],
};

export function can(role: Role, permission: Permission): boolean {
  return MATRIX[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super-Admin",
  ANALYST: "Analyst",
  ADVISOR: "Berater",
  READ_ONLY: "Leserechte",
};
