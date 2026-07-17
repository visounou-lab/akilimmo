import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export const SESSION_COOKIE = "sf_session";

export type SessionStage = "mfa_pending" | "authenticated";

export interface SessionPayload {
  sub: string; // user id
  role: Role;
  stage: SessionStage;
  name: string;
}

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short (min 16 chars).");
  }
  return new TextEncoder().encode(value);
}

/** Signs a session token. `mfa_pending` tokens are short-lived (10 min). */
export async function signSession(payload: SessionPayload): Promise<string> {
  const ttl = payload.stage === "authenticated" ? "8h" : "10m";
  return new SignJWT({ role: payload.role, stage: payload.stage, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.role || !payload.stage) return null;
    return {
      sub: payload.sub as string,
      role: payload.role as Role,
      stage: payload.stage as SessionStage,
      name: (payload.name as string) ?? "",
    };
  } catch {
    return null;
  }
}
