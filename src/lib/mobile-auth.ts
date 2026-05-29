import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET ?? "fallback-secret";

type MobileUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function verifyMobileToken(req: NextRequest): MobileUser | null {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) return null;
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as MobileUser;
    return payload;
  } catch {
    return null;
  }
}
