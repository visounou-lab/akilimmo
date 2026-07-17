"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { hashPassword } from "@/lib/auth/password";
import { writeAudit } from "@/lib/audit";

const ROLES: Role[] = ["SUPER_ADMIN", "ANALYST", "ADVISOR", "READ_ONLY"];

export async function createUserAction(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "READ_ONLY") as Role;

  if (!email || !name || password.length < 8 || !ROLES.includes(role)) {
    redirect("/admin/users?error=invalid");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/admin/users?error=exists");
  }

  const created = await prisma.user.create({
    data: { email, name, role, passwordHash: await hashPassword(password), status: "ACTIVE", mfaEnabled: false },
  });
  await writeAudit({ actorId: actor.id, action: "user.created", entity: "User", entityId: created.id, metadata: { email, role } });
  revalidatePath("/admin/users");
}

export async function setUserStatusAction(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const id = String(formData.get("id") ?? "");
  const disable = String(formData.get("disable") ?? "") === "1";
  if (id === actor.id) return; // never lock yourself out

  await prisma.user.update({ where: { id }, data: { status: disable ? "DISABLED" : "ACTIVE" } });
  await writeAudit({ actorId: actor.id, action: disable ? "user.disabled" : "user.enabled", entity: "User", entityId: id });
  revalidatePath("/admin/users");
}

export async function resetMfaAction(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const id = String(formData.get("id") ?? "");
  await prisma.user.update({ where: { id }, data: { mfaEnabled: false, totpSecret: null } });
  await writeAudit({ actorId: actor.id, action: "user.mfa_reset", entity: "User", entityId: id });
  revalidatePath("/admin/users");
}
