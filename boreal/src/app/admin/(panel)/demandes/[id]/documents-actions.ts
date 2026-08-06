"use server";

import { revalidatePath } from "next/cache";
import type { DocumentType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import {
  buildDocumentPayload,
  documentFingerprint,
  DOCUMENT_LABELS,
  AVAILABLE_DOCUMENT_TYPES,
} from "@/lib/documents";

export async function generateDocumentAction(formData: FormData): Promise<void> {
  const user = await requirePermission("documents.generate");
  const applicationId = String(formData.get("applicationId"));
  const type = String(formData.get("type")) as DocumentType;
  if (!AVAILABLE_DOCUMENT_TYPES.includes(type)) return;

  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return;
  const settings = await prisma.companySettings.findUnique({
    where: { id: "singleton" },
  });

  const payload = buildDocumentPayload(app, settings);
  const fingerprint = documentFingerprint(payload);
  const version = (await prisma.document.count({ where: { applicationId, type } })) + 1;

  const doc = await prisma.document.create({
    data: {
      applicationId,
      type,
      version,
      sha256: fingerprint,
      payload: payload as unknown as Prisma.InputJsonValue,
      isDraft: true,
      createdById: user.id,
    },
  });

  await writeAudit({
    actorId: user.id,
    action: "document.generate",
    entityType: "Document",
    entityId: doc.id,
    summary: `${DOCUMENT_LABELS[type]} (brouillon) généré pour ${app.reference}`,
  });
  revalidatePath(`/admin/demandes/${applicationId}`);
}
