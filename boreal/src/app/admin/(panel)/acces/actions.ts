"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth/guards";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { writeAudit } from "@/lib/audit";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export interface AccessState {
  error?: string;
  success?: string;
}

export async function createUserAction(
  _prev: AccessState,
  formData: FormData,
): Promise<AccessState> {
  const actor = await requirePermission("users.manage");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "") as Role;
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Nom, courriel et mot de passe sont requis." };
  }
  if (password.length < 10) {
    return { error: "Le mot de passe doit contenir au moins 10 caractères." };
  }
  if (!ROLES.includes(role)) {
    return { error: "Rôle invalide." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec ce courriel." };
  }

  await prisma.user.create({
    data: { name, email, role, passwordHash: await hashPassword(password) },
  });
  await writeAudit({
    actorId: actor.id,
    action: "user.create",
    entityType: "User",
    entityId: email,
    summary: `Compte créé : ${email} (${ROLE_LABELS[role]})`,
  });
  revalidatePath("/admin/acces");
  return { success: `Compte ${email} créé.` };
}

export async function setUserRoleAction(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const userId = String(formData.get("userId"));
  const role = String(formData.get("role") ?? "") as Role;
  if (!ROLES.includes(role)) return;
  await prisma.user.update({ where: { id: userId }, data: { role } });
  await writeAudit({
    actorId: actor.id,
    action: "user.role",
    entityType: "User",
    entityId: userId,
    summary: `Rôle modifié → ${ROLE_LABELS[role]}`,
  });
  revalidatePath("/admin/acces");
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const userId = String(formData.get("userId"));
  if (userId === actor.id) return; // ne pas se désactiver soi-même
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { active: true } });
  if (!u) return;
  await prisma.user.update({ where: { id: userId }, data: { active: !u.active } });
  await writeAudit({
    actorId: actor.id,
    action: "user.active",
    entityType: "User",
    entityId: userId,
    summary: u.active ? "Compte désactivé" : "Compte réactivé",
  });
  revalidatePath("/admin/acces");
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const userId = String(formData.get("userId"));
  if (userId === actor.id) return; // ne pas se supprimer soi-même
  await prisma.user.delete({ where: { id: userId } });
  await writeAudit({
    actorId: actor.id,
    action: "user.delete",
    entityType: "User",
    entityId: userId,
    summary: "Compte supprimé",
  });
  revalidatePath("/admin/acces");
}

export async function changeOwnPasswordAction(
  _prev: AccessState,
  formData: FormData,
): Promise<AccessState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) {
    return { error: "Le nouveau mot de passe doit contenir au moins 10 caractères." };
  }
  if (next !== confirm) {
    return { error: "La confirmation ne correspond pas." };
  }
  const fresh = await prisma.user.findUnique({ where: { id: user.id } });
  if (!fresh || !(await verifyPassword(current, fresh.passwordHash))) {
    return { error: "Mot de passe actuel incorrect." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });
  await writeAudit({
    actorId: user.id,
    action: "user.password",
    summary: "Mot de passe modifié",
  });
  return { success: "Mot de passe mis à jour." };
}
