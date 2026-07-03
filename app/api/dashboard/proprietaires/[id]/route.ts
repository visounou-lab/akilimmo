import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail, sendPropertySubmitReminderEmail } from "@/lib/mailer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  const owner = await prisma.user.findUnique({
    where: { id },
    include: {
      verificationCases: {
        where: { type: { in: ["IDENTITY", "PROFESSIONAL"] } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!owner) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (action === "activate") {
    const identityApproved = owner.verificationCases.some(
      (item) =>
        item.type === "IDENTITY" &&
        item.status === "APPROVED" &&
        (!item.expiresAt || item.expiresAt > new Date()),
    );
    if (!owner.isVerified || !identityApproved) {
      return NextResponse.json(
        { error: "L'email et l'identité doivent être vérifiés avant activation." },
        { status: 409 },
      );
    }

    const targetRole = owner.requestedRole ?? owner.role;
    if (targetRole === "AGENT") {
      const professionalApproved = owner.verificationCases.some(
        (item) =>
          item.type === "PROFESSIONAL" &&
          item.status === "APPROVED" &&
          (!item.expiresAt || item.expiresAt > new Date()),
      );
      if (!professionalApproved) {
        return NextResponse.json(
          { error: "Les justificatifs professionnels doivent être validés avant activation." },
          { status: 409 },
        );
      }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { role: targetRole, requestedRole: null, status: "active" },
      }),
      prisma.verificationAuditLog.create({
        data: {
          actorId: (session.user as { id: string }).id,
          action: "ROLE_ACTIVATED",
          reason: `Activation du rôle ${targetRole}`,
          metadata: { subjectUserId: id, role: targetRole },
        },
      }),
    ]);
    const firstName = owner.name?.split(" ")[0] ?? "Propriétaire";
    if (owner.email) {
      await sendWelcomeEmail(owner.email, firstName);
      await sendPropertySubmitReminderEmail(owner.email, firstName);
    }
    return NextResponse.json({ message: "Compte activé" });
  }

  if (action === "suspend") {
    await prisma.user.update({ where: { id }, data: { status: "suspended" } });
    return NextResponse.json({ message: "Compte suspendu" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
