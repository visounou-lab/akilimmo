import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET ?? "fallback-secret";

type TokenPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function verifyMobileToken(req: NextRequest): TokenPayload | null {
  try {
    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) return null;
    const token = auth.slice(7);
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
