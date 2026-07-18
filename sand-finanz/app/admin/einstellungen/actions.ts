"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { writeAudit } from "@/lib/audit";

function s(fd: FormData, k: string): string | null {
  const v = String(fd.get(k) ?? "").trim();
  return v || null;
}

export async function updateSettingsAction(formData: FormData) {
  const user = await requirePermission("settings.manage");
  const data = {
    legalName: s(formData, "legalName") ?? "SAND FINANZ GRUPPE",
    address: s(formData, "address"),
    registration: s(formData, "registration"),
    vatId: s(formData, "vatId"),
    shareCapital: s(formData, "shareCapital"),
    email: s(formData, "email"),
    phone: s(formData, "phone"),
    bankName: s(formData, "bankName"),
    iban: s(formData, "iban"),
    bic: s(formData, "bic"),
    representative: s(formData, "representative"),
    updatedById: user.id,
  };
  await prisma.companySettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  await writeAudit({ actorId: user.id, action: "settings.updated", entity: "CompanySettings", entityId: "default" });
  revalidatePath("/admin/einstellungen");
}
