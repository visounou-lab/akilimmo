import { NextRequest, NextResponse } from "next/server";
import { sendContactRequest } from "@/lib/mailer";

// In-memory rate limit: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  console.log("[/api/contact] POST from IP:", ip);

  if (!checkRateLimit(ip)) {
    console.warn("[/api/contact] rate limit exceeded for IP:", ip);
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de réessayer dans 10 minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { nom, email, telephone, pays, sujet, message } = body as Record<string, string>;

  if (!nom?.trim() || !email?.trim() || !message?.trim()) {
    console.log("[/api/contact] validation failed — champs requis manquants");
    return NextResponse.json({ error: "champs requis" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email.trim())) {
    console.log("[/api/contact] validation failed — email invalide:", email);
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  console.log("[/api/contact] sending email for:", email.trim(), "sujet:", sujet);

  try {
    await sendContactRequest({
      nom:       nom.trim(),
      email:     email.trim(),
      telephone: telephone?.trim() || undefined,
      pays:      pays?.trim() || undefined,
      sujet:     sujet?.trim() || "Non précisé",
      message:   message.trim(),
    });
    console.log("[/api/contact] email sent successfully for:", email.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] sendMail error:", err);
    return NextResponse.json(
      {
        error:
          "Impossible d'envoyer votre demande pour le moment, merci de réessayer plus tard ou de nous écrire directement à info@akilimmo.com",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée." }, { status: 405 });
}
