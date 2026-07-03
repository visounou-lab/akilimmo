import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const adminId = (session?.user as { id?: string } | undefined)?.id;
  if (!adminId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { action?: "approve" | "reject"; reason?: string }
    | null;
  if (!body || !["approve", "reject"].includes(body.action ?? "")) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const reason = body.reason?.trim();
  if (body.action === "reject" && (!reason || reason.length < 5)) {
    return NextResponse.json(
      { error: "Un motif de refus précis est obligatoire." },
      { status: 400 },
    );
  }

  const verificationCase = await prisma.verificationCase.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!verificationCase) {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
  }
  if (verificationCase.status !== "PENDING") {
    return NextResponse.json({ error: "Ce dossier a déjà été traité." }, { status: 409 });
  }

  const approved = body.action === "approve";
  const now = new Date();
  const expiresAt = approved
    ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    : null;

  await prisma.$transaction([
    prisma.verificationCase.update({
      where: { id },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        reviewedById: adminId,
        reviewedAt: now,
        expiresAt,
        rejectionReason: approved ? null : reason,
      },
    }),
    prisma.verificationAuditLog.create({
      data: {
        verificationCaseId: id,
        actorId: adminId,
        action: approved ? "CASE_APPROVED" : "CASE_REJECTED",
        fromStatus: "PENDING",
        toStatus: approved ? "APPROVED" : "REJECTED",
        reason: approved ? null : reason,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
