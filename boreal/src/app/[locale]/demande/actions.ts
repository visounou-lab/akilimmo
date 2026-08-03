"use server";

import { headers } from "next/headers";

import { applicationSchema } from "@/lib/application-schema";
import { computeSimulation } from "@/lib/finance";
import { products } from "@/lib/products";
import { currencyForCountry } from "@/lib/countries";
import { generateReference, sanitizeReference } from "@/lib/reference";
import { prisma } from "@/lib/prisma";
import { writeAudit } from "@/lib/audit";

export interface SubmitResult {
  ok: boolean;
  reference?: string;
  persisted?: boolean;
  error?: "validation";
}

export async function submitApplication(
  raw: unknown,
  clientReference: string,
  locale: string,
): Promise<SubmitResult> {
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }
  const data = parsed.data;

  const product = products.find((p) => p.key === data.product);
  if (!product) return { ok: false, error: "validation" };

  // Recompute server-side — never trust client figures.
  const rate = product.fromRate;
  const sim = computeSimulation({
    amount: data.amount,
    months: data.months,
    annualRate: rate,
  });
  const currency = currencyForCountry(data.country);

  const baseRef = sanitizeReference(clientReference) ?? generateReference();

  const record = {
    status: "SUBMITTED" as const,
    locale: locale === "en" ? "en" : "fr",
    product: data.product,
    country: data.country,
    currency,
    amount: Math.round(data.amount),
    months: data.months,
    annualRate: rate,
    monthlyPayment: sim.monthlyPayment,
    totalCost: sim.totalInterest,
    purpose: data.purpose || null,
    salutation: data.salutation || null,
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate ? new Date(data.birthDate) : null,
    nationality: data.nationality || null,
    nationalId: data.nationalId || null,
    addressLine: data.addressLine || null,
    postalCode: data.postalCode || null,
    city: data.city || null,
    phone: data.phone,
    email: data.email,
    occupation: data.occupation || null,
    monthlyIncome: data.monthlyIncome,
    monthlyExpenses: data.monthlyExpenses,
    housingSituation: data.housingSituation || null,
    existingCredits: data.existingCredits || null,
    consentDataProcessing: true,
    consentAccuracy: true,
    consentContact: true,
    consentMarketing: data.consentMarketing ?? false,
  };

  try {
    let reference = baseRef;
    // Retry once on the rare reference collision.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await prisma.application.create({ data: { ...record, reference } });
        break;
      } catch (err) {
        if (attempt === 0 && isUniqueViolation(err)) {
          reference = generateReference();
          continue;
        }
        throw err;
      }
    }

    const hdrs = await headers();
    await writeAudit({
      action: "application.submitted",
      entityType: "Application",
      entityId: reference,
      summary: `Nouvelle demande ${reference} (${data.product}, ${currency})`,
      ip: hdrs.get("x-forwarded-for"),
    });

    return { ok: true, reference, persisted: true };
  } catch (error) {
    // Preview / local without a database: keep the UX working (demo mode).
    console.error("[submitApplication] persistence unavailable", error);
    return { ok: true, reference: baseRef, persisted: false };
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}
