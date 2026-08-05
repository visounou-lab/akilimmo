"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroyCurrentSession } from "@/lib/auth/session";
import { getCurrentUser, LOGIN_PATH } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Veuillez renseigner votre courriel et votre mot de passe." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Identifiants invalides." };
  }

  const hdrs = await headers();
  await createSession(user.id, {
    ip: hdrs.get("x-forwarded-for"),
    userAgent: hdrs.get("user-agent"),
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await writeAudit({
    actorId: user.id,
    action: "auth.login",
    summary: `Connexion de ${user.email}`,
    ip: hdrs.get("x-forwarded-for"),
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await writeAudit({
      actorId: user.id,
      action: "auth.logout",
      summary: `Déconnexion de ${user.email}`,
    });
  }
  await destroyCurrentSession();
  redirect(LOGIN_PATH);
}
