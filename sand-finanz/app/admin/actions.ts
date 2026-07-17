"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { generateTotpSecret, verifyTotp } from "@/lib/auth/totp";
import {
  clearSession,
  completeAuthentication,
  readSession,
  startMfaPending,
} from "@/lib/auth/server";
import { writeAudit } from "@/lib/audit";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user && user.status === "ACTIVE" && (await verifyPassword(password, user.passwordHash));
  if (!user || !ok) {
    await writeAudit({ action: "login.failed", entity: "User", entityId: user?.id, metadata: { email } });
    redirect("/admin/login?error=invalid");
  }

  await writeAudit({ actorId: user.id, action: "login.password_ok", entity: "User", entityId: user.id });

  if (user.mfaEnabled && user.totpSecret) {
    await startMfaPending(user);
    redirect("/admin/mfa");
  }

  // Force TOTP enrolment before granting access (MFA is mandatory).
  if (!user.totpSecret) {
    await prisma.user.update({ where: { id: user.id }, data: { totpSecret: generateTotpSecret() } });
  }
  await startMfaPending(user);
  redirect("/admin/mfa/enroll");
}

export async function verifyMfaAction(formData: FormData) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.totpSecret || user.status !== "ACTIVE") redirect("/admin/login");

  const token = String(formData.get("token") ?? "");
  if (!verifyTotp(token, user.totpSecret)) {
    await writeAudit({ actorId: user.id, action: "login.mfa_failed", entity: "User", entityId: user.id });
    redirect("/admin/mfa?error=invalid");
  }

  await completeAuthentication(user);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAudit({ actorId: user.id, action: "login.mfa_ok", entity: "User", entityId: user.id });
  redirect("/admin");
}

export async function enrollMfaAction(formData: FormData) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.totpSecret || user.status !== "ACTIVE") redirect("/admin/login");

  const token = String(formData.get("token") ?? "");
  if (!verifyTotp(token, user.totpSecret)) {
    redirect("/admin/mfa/enroll?error=invalid");
  }

  await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
  await completeAuthentication(user);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAudit({ actorId: user.id, action: "mfa.enrolled", entity: "User", entityId: user.id });
  redirect("/admin");
}

export async function logoutAction() {
  const session = await readSession();
  if (session) await writeAudit({ actorId: session.sub, action: "logout", entity: "User", entityId: session.sub });
  await clearSession();
  redirect("/admin/login");
}
