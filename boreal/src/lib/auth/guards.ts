import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";

import { getSessionUser } from "./session";
import { can, type Permission } from "./rbac";

export const LOGIN_PATH = "/admin/connexion";
export const FORBIDDEN_PATH = "/admin/acces-refuse";

/** Current user or null — safe to call from any server component. */
export async function getCurrentUser(): Promise<User | null> {
  return getSessionUser();
}

/** Require an authenticated user; redirect to login otherwise. */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

/** Require a specific permission; redirect to the forbidden page otherwise. */
export async function requirePermission(
  permission: Permission,
): Promise<User> {
  const user = await requireUser();
  if (!can(user.role, permission)) redirect(FORBIDDEN_PATH);
  return user;
}
