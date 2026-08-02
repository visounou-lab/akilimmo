import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface AuditInput {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string | null;
}

/**
 * Append an entry to the audit journal. Best-effort: auditing must never break
 * the primary operation, so failures are swallowed (and logged to stderr).
 */
export async function writeAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        summary: input.summary,
        metadata: input.metadata,
        ip: input.ip ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] failed to write entry", error);
  }
}
