import { NextRequest, NextResponse } from "next/server";
import type { VerificationDocumentType, VerificationType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  deletePrivateVerificationDocument,
  uploadPrivateVerificationDocument,
} from "@/lib/cloudinary";
import { rateLimit } from "@/lib/ratelimit";
import {
  ALLOWED_DOCUMENTS_BY_CASE,
  checksumVerificationFile,
  detectVerificationFile,
  MAX_VERIFICATION_FILE_SIZE,
} from "@/lib/verification-documents";

const CANDIDATE_CASES = ["IDENTITY", "OWNER_AUTHORITY", "PROFESSIONAL"] as const;

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { allowed, retryAfterMs } = rateLimit(`verification-upload:${userId}`, 12, 3_600_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de fichiers envoyés. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: { requestedRole: true, role: true },
  });
  if (!account) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file");
  const caseType = formData.get("caseType");
  const documentType = formData.get("documentType");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
  }
  if (file.size > MAX_VERIFICATION_FILE_SIZE) {
    return NextResponse.json({ error: "Le fichier dépasse la limite de 8 Mo." }, { status: 413 });
  }
  if (
    typeof caseType !== "string" ||
    !CANDIDATE_CASES.includes(caseType as (typeof CANDIDATE_CASES)[number]) ||
    typeof documentType !== "string"
  ) {
    return NextResponse.json({ error: "Type de justificatif invalide" }, { status: 400 });
  }

  const typedCase = caseType as Extract<VerificationType, "IDENTITY" | "OWNER_AUTHORITY" | "PROFESSIONAL">;
  const typedDocument = documentType as VerificationDocumentType;
  const expectedSecondaryCase = account.requestedRole === "AGENT" ? "PROFESSIONAL" : "OWNER_AUTHORITY";

  if (typedCase !== "IDENTITY" && typedCase !== expectedSecondaryCase) {
    return NextResponse.json({ error: "Ce justificatif ne correspond pas au rôle demandé." }, { status: 403 });
  }
  if (!ALLOWED_DOCUMENTS_BY_CASE[typedCase].includes(typedDocument)) {
    return NextResponse.json({ error: "Type de document non autorisé pour ce dossier." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectVerificationFile(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: "Format non accepté. Utilisez un PDF, JPEG ou PNG valide." },
      { status: 415 },
    );
  }

  const verificationCase = await prisma.verificationCase.upsert({
    where: {
      id:
        (
          await prisma.verificationCase.findFirst({
            where: { subjectUserId: userId, type: typedCase },
            orderBy: { createdAt: "desc" },
            select: { id: true },
          })
        )?.id ?? crypto.randomUUID(),
    },
    update: {},
    create: {
      subjectUserId: userId,
      type: typedCase,
      status: "NOT_SUBMITTED",
    },
    include: {
      documents: {
        where: { type: typedDocument },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (["PENDING", "APPROVED", "SUSPENDED"].includes(verificationCase.status)) {
    return NextResponse.json(
      { error: "Ce dossier ne peut plus être modifié dans son état actuel." },
      { status: 409 },
    );
  }

  const uploaded = await uploadPrivateVerificationDocument(buffer, detected.extension);
  const checksum = checksumVerificationFile(buffer);
  const previousDocuments = verificationCase.documents;

  try {
    const document = await prisma.$transaction(async (tx) => {
      if (previousDocuments.length > 0) {
        await tx.verificationDocument.deleteMany({
          where: { id: { in: previousDocuments.map((item) => item.id) } },
        });
      }
      const created = await tx.verificationDocument.create({
        data: {
          verificationCaseId: verificationCase.id,
          type: typedDocument,
          storageKey: uploaded.storageKey,
          originalName: file.name.slice(0, 180),
          mimeType: detected.mimeType,
          sizeBytes: file.size,
          checksum,
        },
        select: { id: true, type: true, originalName: true, createdAt: true },
      });
      await tx.verificationAuditLog.create({
        data: {
          verificationCaseId: verificationCase.id,
          actorId: userId,
          action: "DOCUMENT_UPLOADED",
          metadata: { documentId: created.id, type: typedDocument },
        },
      });
      return created;
    });

    await Promise.allSettled(
      previousDocuments.map((item) => deletePrivateVerificationDocument(item.storageKey)),
    );
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    await deletePrivateVerificationDocument(uploaded.storageKey).catch(() => undefined);
    console.error("[verification upload]", error);
    return NextResponse.json({ error: "Enregistrement du document impossible." }, { status: 500 });
  }
}
