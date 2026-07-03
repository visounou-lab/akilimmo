import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/ratelimit";

const REASONS = ["FAKE_LISTING", "SCAM_REQUEST", "WRONG_INFORMATION", "UNAVAILABLE", "OTHER"] as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterMs } = rateLimit(`listing-report:${ip}`, 3, 24 * 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de signalements. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  const payload = (await req.json().catch(() => null)) as {
    reason?: string;
    details?: string;
    email?: string;
    website?: string;
  } | null;
  if (payload?.website) return NextResponse.json({ success: true });
  if (!payload || !REASONS.includes(payload.reason as (typeof REASONS)[number])) {
    return NextResponse.json({ error: "Motif invalide." }, { status: 400 });
  }
  const reason = payload.reason as (typeof REASONS)[number];
  const details = payload.details?.trim() ?? "";
  if (details.length < 10 || details.length > 1500) {
    return NextResponse.json(
      { error: "Décrivez le problème en 10 à 1 500 caractères." },
      { status: 400 },
    );
  }
  const email = payload.email?.trim().toLowerCase() || null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { id: true, publishStatus: true },
  });
  if (!property || property.publishStatus !== "published") {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  const session = await auth();
  const reporterId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const sourceHash = createHash("sha256")
    .update(`${ip}:${process.env.NEXTAUTH_SECRET ?? "akil-report"}`)
    .digest("hex");
  const recentDuplicate = await prisma.listingReport.findFirst({
    where: {
      propertyId: property.id,
      sourceHash,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { id: true },
  });
  if (recentDuplicate) return NextResponse.json({ success: true });

  await prisma.listingReport.create({
    data: {
      propertyId: property.id,
      reporterId,
      reporterEmail: email,
      reason,
      details,
      priority: ["FAKE_LISTING", "SCAM_REQUEST"].includes(reason) ? "HIGH" : "NORMAL",
      sourceHash,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
