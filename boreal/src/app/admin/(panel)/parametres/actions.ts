"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";

const FIELDS = [
  "legalName",
  "legalForm",
  "registerCourt",
  "registerNumber",
  "lei",
  "vatId",
  "iban",
  "bic",
  "managingDirector",
  "supervisoryAuthority",
  "addressLine",
  "postalCode",
  "city",
  "country",
  "email",
  "phone",
  "website",
] as const;

export async function updateSettingsAction(formData: FormData): Promise<void> {
  const user = await requirePermission("settings.manage");

  const data: Record<string, string | null> = {};
  for (const f of FIELDS) {
    const v = String(formData.get(f) ?? "").trim();
    data[f] = v || null;
  }

  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    update: { ...data, updatedById: user.id },
    create: { id: "singleton", ...data, updatedById: user.id },
  });
  await writeAudit({
    actorId: user.id,
    action: "settings.update",
    entityType: "CompanySettings",
    summary: "Réglages société mis à jour",
  });
  revalidatePath("/admin/parametres");
}
