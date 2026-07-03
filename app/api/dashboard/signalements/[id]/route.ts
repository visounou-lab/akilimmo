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
  const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { role: true } });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as
    | { action?: "review" | "dismiss" | "suspend"; resolution?: string }
    | null;
  if (!body?.action || !["review", "dismiss", "suspend"].includes(body.action)) {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }
  const { id } = await params;
  const report = await prisma.listingReport.findUnique({
    where: { id },
    select: { id: true, status: true, propertyId: true },
  });
  if (!report) return NextResponse.json({ error: "Signalement introuvable." }, { status: 404 });

  if (body.action === "review") {
    await prisma.listingReport.update({
      where: { id },
      data: { status: "IN_REVIEW", reviewedById: adminId, reviewedAt: new Date() },
    });
  } else {
    const resolution = body.resolution?.trim();
    if (!resolution || resolution.length < 5) {
      return NextResponse.json({ error: "Une note de décision est obligatoire." }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.listingReport.update({
        where: { id },
        data: {
          status: body.action === "suspend" ? "RESOLVED" : "DISMISSED",
          resolution,
          reviewedById: adminId,
          reviewedAt: new Date(),
        },
      }),
      ...(body.action === "suspend"
        ? [
            prisma.property.update({
              where: { id: report.propertyId },
              data: { publishStatus: "suspended", adminNote: resolution },
            }),
          ]
        : []),
    ]);
  }
  return NextResponse.json({ success: true });
}
