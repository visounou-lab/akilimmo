"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { writeAudit } from "@/lib/audit";
import { calculate, type CreditProductVersion } from "@/lib/credit-engine";
import { ALL_STATUSES } from "@/lib/application-status";

function s(fd: FormData, k: string): string | null {
  const v = String(fd.get(k) ?? "").trim();
  return v || null;
}
function n(fd: FormData, k: string): number | null {
  const v = fd.get(k);
  const num = Number(v);
  return v != null && String(v).trim() !== "" && Number.isFinite(num) ? num : null;
}

/** Full dossier edit (personal data, credit request, bank details, status). */
export async function updateApplicationAction(formData: FormData) {
  const user = await requirePermission("applications.edit");
  const reference = String(formData.get("reference") ?? "");
  const app = await prisma.application.findUnique({ where: { reference } });
  if (!app) return;

  const status = String(formData.get("status") ?? app.status) as ApplicationStatus;
  const amount = n(formData, "amount");
  const termMonths = n(formData, "termMonths");

  await prisma.$transaction(async (tx) => {
    await tx.customer.update({
      where: { id: app.customerId },
      data: {
        firstName: s(formData, "firstName") ?? "",
        lastName: s(formData, "lastName") ?? "",
        email: s(formData, "email") ?? "",
        phone: s(formData, "phone"),
        birthDate: s(formData, "birthDate"),
        occupation: s(formData, "occupation"),
        address: s(formData, "address"),
        postalCode: s(formData, "postalCode"),
        city: s(formData, "city"),
      },
    });
    await tx.application.update({
      where: { reference },
      data: {
        amount: amount ?? app.amount,
        termMonths: termMonths ?? app.termMonths,
        purpose: s(formData, "purpose"),
        insuranceAmount: n(formData, "insuranceAmount"),
        bankName: s(formData, "bankName"),
        iban: s(formData, "iban"),
        bic: s(formData, "bic"),
        paymentStartDate: s(formData, "paymentStartDate"),
        transferDate: s(formData, "transferDate"),
        status: ALL_STATUSES.includes(status) ? status : app.status,
      },
    });
    // income lives on the financial profile
    const income = n(formData, "income");
    await tx.financialProfile.upsert({
      where: { applicationId: reference },
      update: { income },
      create: { applicationId: reference, income },
    });
  });

  await writeAudit({ actorId: user.id, action: "application.updated", entity: "Application", entityId: reference });
  revalidatePath(`/admin/applications/${reference}`);
}

export async function deleteApplicationAction(formData: FormData) {
  const user = await requirePermission("applications.delete");
  const reference = String(formData.get("reference") ?? "");
  await prisma.application.delete({ where: { reference } });
  await writeAudit({ actorId: user.id, action: "application.deleted", entity: "Application", entityId: reference });
  redirect("/admin/applications");
}

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
