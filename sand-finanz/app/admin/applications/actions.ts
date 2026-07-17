"use server";

import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { writeAudit } from "@/lib/audit";
import { calculate, type CreditProductVersion } from "@/lib/credit-engine";
import { ALL_STATUSES } from "@/lib/application-status";

export async function changeStatusAction(formData: FormData) {
  const user = await requirePermission("applications.changeStatus");
  const reference = String(formData.get("reference") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  if (!ALL_STATUSES.includes(status)) return;

  const before = await prisma.application.findUnique({ where: { reference } });
  if (!before) return;

  await prisma.application.update({ where: { reference }, data: { status } });
  await writeAudit({
    actorId: user.id,
    action: "application.status_changed",
    entity: "Application",
    entityId: reference,
    metadata: { from: before.status, to: status },
  });
  revalidatePath(`/admin/applications/${reference}`);
}

export async function addNoteAction(formData: FormData) {
  const user = await requirePermission("applications.addNote");
  const reference = String(formData.get("reference") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.applicationNote.create({ data: { applicationId: reference, authorId: user.id, body } });
  await writeAudit({ actorId: user.id, action: "application.note_added", entity: "Application", entityId: reference });
  revalidatePath(`/admin/applications/${reference}`);
}

export async function assignToMeAction(formData: FormData) {
  const user = await requirePermission("applications.assign");
  const reference = String(formData.get("reference") ?? "");
  await prisma.application.update({ where: { reference }, data: { assignedToId: user.id } });
  await writeAudit({ actorId: user.id, action: "application.assigned", entity: "Application", entityId: reference, metadata: { to: user.id } });
  revalidatePath(`/admin/applications/${reference}`);
}

/**
 * Prepares an offer using the SAME versioned credit engine as the public
 * calculator, so the figures are identical for identical parameters. Binds the
 * offer to the exact product version used, per the plan's immutability rule.
 */
export async function createOfferAction(formData: FormData) {
  const user = await requirePermission("applications.createOffer");
  const reference = String(formData.get("reference") ?? "");

  const app = await prisma.application.findUnique({ where: { reference } });
  if (!app) return;

  // Latest published version for this country + product.
  const version = await prisma.creditProductVersion.findFirst({
    where: { country: app.country, productType: app.productType, status: "PUBLISHED" },
    orderBy: { version: "desc" },
  });
  if (!version) {
    await writeAudit({ actorId: user.id, action: "offer.no_product_version", entity: "Application", entityId: reference });
    return;
  }

  const params: CreditProductVersion = {
    id: version.id,
    version: version.version,
    country: version.country,
    productType: version.productType,
    currency: version.currency,
    minAmount: version.minAmount,
    maxAmount: version.maxAmount,
    minTerm: version.minTerm,
    maxTerm: version.maxTerm,
    nominalRate: version.nominalRate,
    effectiveRate: version.effectiveRate ?? undefined,
    originationFee:
      version.originationFeeType && version.originationFeeValue != null
        ? { type: version.originationFeeType, value: version.originationFeeValue }
        : null,
    rounding: { unit: version.roundingUnit, mode: version.roundingMode },
    activeFrom: version.activeFrom,
    activeTo: version.activeTo,
    disclaimerKey: version.disclaimerKey,
  };

  // Clamp to product bounds so an out-of-range legacy amount still yields an offer.
  const principal = Math.min(Math.max(app.amount, version.minAmount), version.maxAmount);
  const termMonths = Math.min(Math.max(app.termMonths, version.minTerm), version.maxTerm);
  const r = calculate({ principal, termMonths }, params);

  await prisma.offer.create({
    data: {
      applicationId: reference,
      productVersionId: version.id,
      principal: r.principal,
      termMonths: r.termMonths,
      monthlyPayment: r.monthlyPayment,
      totalInterest: r.totalInterest,
      totalCost: r.totalCost,
      effectiveRate: r.effectiveRate,
      status: "DRAFT",
    },
  });
  await prisma.application.update({ where: { reference }, data: { status: "OFFER_PREPARED" } });
  await writeAudit({
    actorId: user.id,
    action: "offer.created",
    entity: "Application",
    entityId: reference,
    metadata: { productVersionId: version.id, monthlyPayment: r.monthlyPayment },
  });
  revalidatePath(`/admin/applications/${reference}`);
}
