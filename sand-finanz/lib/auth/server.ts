import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "./session";
import { can, type Permission } from "./rbac";

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

async function setSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: payload.stage === "authenticated" ? 60 * 60 * 8 : 60 * 10,
  });
}

export async function startMfaPending(user: Pick<User, "id" | "role" | "name">) {
  await setSessionCookie({ sub: user.id, role: user.role, name: user.name, stage: "mfa_pending" });
}

export async function completeAuthentication(user: Pick<User, "id" | "role" | "name">) {
  await setSessionCookie({ sub: user.id, role: user.role, name: user.name, stage: "authenticated" });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Full authenticated user (MFA satisfied) or null. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await readSession();
  if (!session || session.stage !== "authenticated") return null;
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
}

/** Redirects to login unless a fully authenticated, active user is present. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermission(permission: Permission): Promise<User> {
  const user = await requireUser();
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}
