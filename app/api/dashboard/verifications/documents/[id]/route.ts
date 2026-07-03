import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { privateVerificationDocumentUrl } from "@/lib/cloudinary";

export async function GET(
  _req: Request,
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
  const document = await prisma.verificationDocument.findUnique({
    where: { id },
    select: {
      id: true,
      storageKey: true,
      originalName: true,
      mimeType: true,
      verificationCaseId: true,
    },
  });
  if (!document) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const extensionByMimeType: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
  };
  const extension = document.mimeType ? extensionByMimeType[document.mimeType] : undefined;
  if (!extension) {
    return NextResponse.json({ error: "Format de document invalide" }, { status: 422 });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;
  const url = privateVerificationDocumentUrl(
    document.storageKey,
    extension,
    expiresAt,
  );

  await prisma.verificationAuditLog.create({
    data: {
      verificationCaseId: document.verificationCaseId,
      actorId: adminId,
      action: "DOCUMENT_ACCESSED",
      metadata: { documentId: document.id },
    },
  });

  return NextResponse.redirect(url);
}
