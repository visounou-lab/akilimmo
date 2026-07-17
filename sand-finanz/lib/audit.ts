import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/** Records an auditable action. Never throws into the caller's flow. */
export async function writeAudit(entry: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    let ip: string | undefined;
    try {
      const h = await headers();
      ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    } catch {
      // headers() unavailable outside request scope — fine.
    }
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        metadata: entry.metadata,
        ip,
      },
    });
  } catch (err) {
    console.error("[audit] failed to write", err);
  }
}
