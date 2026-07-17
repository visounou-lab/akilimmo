"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { FeeType, RoundingMode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { writeAudit } from "@/lib/audit";

function num(fd: FormData, key: string): number {
  return Number(fd.get(key));
}

/**
 * Publishes a NEW version of a product key rather than mutating the current one.
 * Existing versions stay immutable so historical offers remain reproducible.
 */
export async function publishVersionAction(formData: FormData) {
  const user = await requirePermission("creditProducts.edit");
  const key = String(formData.get("key") ?? "");

  const current = await prisma.creditProductVersion.findFirst({
    where: { key },
    orderBy: { version: "desc" },
  });
  if (!current) redirect("/admin/credit-products");

  const feeType = String(formData.get("originationFeeType") ?? "") as FeeType | "";
  const feeValueRaw = formData.get("originationFeeValue");
  const nextVersion = current.version + 1;

  await prisma.creditProductVersion.create({
    data: {
      key,
      version: nextVersion,
      country: current.country,
      productType: current.productType,
      currency: current.currency,
      minAmount: num(formData, "minAmount"),
      maxAmount: num(formData, "maxAmount"),
      minTerm: num(formData, "minTerm"),
      maxTerm: num(formData, "maxTerm"),
      nominalRate: num(formData, "nominalRate"),
      effectiveRate: formData.get("effectiveRate") ? num(formData, "effectiveRate") : null,
      originationFeeType: feeType === "fixed" || feeType === "percent" ? feeType : null,
      originationFeeValue: feeType && feeValueRaw ? Number(feeValueRaw) : null,
      roundingUnit: num(formData, "roundingUnit") || 0.01,
      roundingMode: (String(formData.get("roundingMode") ?? "nearest") as RoundingMode) || "nearest",
      activeFrom: String(formData.get("activeFrom") ?? current.activeFrom),
      activeTo: formData.get("activeTo") ? String(formData.get("activeTo")) : null,
      disclaimerKey: current.disclaimerKey,
      status: "PUBLISHED",
    },
  });

  // Archive the previous published version of this key.
  await prisma.creditProductVersion.updateMany({
    where: { key, status: "PUBLISHED", version: { lt: nextVersion } },
    data: { status: "ARCHIVED" },
  });

  await writeAudit({
    actorId: user.id,
    action: "creditProduct.version_published",
    entity: "CreditProductVersion",
    entityId: key,
    metadata: { version: nextVersion },
  });

  revalidatePath("/admin/credit-products");
  redirect("/admin/credit-products");
}
