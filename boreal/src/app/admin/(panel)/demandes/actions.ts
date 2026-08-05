"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/admin/status";

export async function updateStatusAction(formData: FormData): Promise<void> {
  const user = await requirePermission("applications.updateStatus");
  const id = String(formData.get("id"));
  const next = String(formData.get("status")) as ApplicationStatus;
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!ALL_STATUSES.includes(next)) return;

  const current = await prisma.application.findUnique({
    where: { id },
    select: { status: true, reference: true },
  });
  if (!current || current.status === next) {
    if (current) revalidatePath(`/admin/demandes/${id}`);
    return;
  }

  await prisma.$transaction([
    prisma.application.update({ where: { id }, data: { status: next } }),
    prisma.statusChange.create({
      data: {
        applicationId: id,
        fromStatus: current.status,
        toStatus: next,
        reason,
        changedById: user.id,
      },
    }),
  ]);
  await writeAudit({
    actorId: user.id,
    action: "application.status",
    entityType: "Application",
    entityId: current.reference,
    summary: `Statut ${STATUS_LABELS[current.status]} → ${STATUS_LABELS[next]}${reason ? ` (${reason})` : ""}`,
  });
  revalidatePath(`/admin/demandes/${id}`);
}

export async function addNoteAction(formData: FormData): Promise<void> {
  const user = await requirePermission("applications.note");
  const id = String(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await prisma.applicationNote.create({
    data: { applicationId: id, authorId: user.id, body },
  });
  await writeAudit({
    actorId: user.id,
    action: "application.note",
    entityType: "Application",
    entityId: id,
    summary: "Note interne ajoutée",
  });
  revalidatePath(`/admin/demandes/${id}`);
}

export async function assignAction(formData: FormData): Promise<void> {
  const user = await requirePermission("applications.assign");
  const id = String(formData.get("id"));
  const assignedToId = String(formData.get("assignedToId") ?? "") || null;
  await prisma.application.update({ where: { id }, data: { assignedToId } });
  await writeAudit({
    actorId: user.id,
    action: "application.assign",
    entityType: "Application",
    entityId: id,
    summary: assignedToId ? "Dossier assigné" : "Assignation retirée",
  });
  revalidatePath(`/admin/demandes/${id}`);
}

export async function deleteApplicationAction(formData: FormData): Promise<void> {
  const user = await requirePermission("applications.delete");
  const id = String(formData.get("id"));
  const app = await prisma.application.findUnique({
    where: { id },
    select: { reference: true },
  });
  await prisma.application.delete({ where: { id } });
  await writeAudit({
    actorId: user.id,
    action: "application.delete",
    entityType: "Application",
    entityId: app?.reference ?? id,
    summary: `Dossier supprimé (${app?.reference ?? id})`,
  });
  revalidatePath("/admin/demandes");
  redirect("/admin/demandes");
}
