import { NextResponse } from "next/server";
import type { VerificationType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRequiredDocuments } from "@/lib/verification-documents";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerified: true,
      requestedRole: true,
      verificationCases: {
        where: { type: { in: ["IDENTITY", "OWNER_AUTHORITY", "PROFESSIONAL"] } },
        include: { documents: { select: { type: true } } },
      },
    },
  });
  if (!account?.requestedRole) {
    return NextResponse.json({ error: "Aucune demande de rôle en attente." }, { status: 409 });
  }
  if (!account.emailVerified) {
    return NextResponse.json({ error: "Confirmez d'abord votre adresse email." }, { status: 409 });
  }

  const requiredTypes: VerificationType[] = [
    "IDENTITY",
    account.requestedRole === "AGENT" ? "PROFESSIONAL" : "OWNER_AUTHORITY",
  ];
  const cases = requiredTypes.map((type) =>
    account.verificationCases.find((item) => item.type === type),
  );

  for (let index = 0; index < requiredTypes.length; index += 1) {
    const verificationCase = cases[index];
    if (
      !verificationCase ||
      !hasRequiredDocuments(
        requiredTypes[index],
        verificationCase.documents.map((item) => item.type),
      )
    ) {
      return NextResponse.json(
        { error: "Tous les justificatifs obligatoires doivent être transmis." },
        { status: 422 },
      );
    }
    if (verificationCase.status === "SUSPENDED") {
      return NextResponse.json({ error: "Un dossier ne peut pas être soumis dans cet état." }, { status: 409 });
    }
  }

  const casesToSubmit = cases.filter(
    (verificationCase) => verificationCase && verificationCase.status !== "APPROVED",
  );
  if (casesToSubmit.length === 0) {
    return NextResponse.json({ error: "Tous les contrôles sont déjà approuvés." }, { status: 409 });
  }

  await prisma.$transaction(
    casesToSubmit.flatMap((verificationCase) => {
      if (!verificationCase) return [];
      return [
        prisma.verificationCase.update({
          where: { id: verificationCase.id },
          data: {
            status: "PENDING",
            submittedAt: new Date(),
            rejectionReason: null,
            suspendedReason: null,
          },
        }),
        prisma.verificationAuditLog.create({
          data: {
            verificationCaseId: verificationCase.id,
            actorId: userId,
            action: "CASE_SUBMITTED",
            fromStatus: verificationCase.status,
            toStatus: "PENDING",
          },
        }),
      ];
    }),
  );

  return NextResponse.json({ success: true });
}
