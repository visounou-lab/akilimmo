import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = ["sejours", "home", "terrains"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const email  = String(body.email ?? "").trim().toLowerCase();
  const source = ALLOWED_SOURCES.includes(String(body.source)) ? String(body.source) : "sejours";
  const rawCountry = body.country;
  const country =
    rawCountry === "BENIN" || rawCountry === "COTE_D_IVOIRE" ? rawCountry : null;

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  try {
    // Idempotent : un même email pour une même source ne crée qu'une entrée.
    await prisma.waitlistEntry.upsert({
      where: { email_source: { email, source } },
      update: { ...(country ? { country } : {}) },
      create: { email, source, country },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/waitlist] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
