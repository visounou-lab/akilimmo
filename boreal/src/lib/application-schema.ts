import { z } from "zod";
import { products } from "./products";
import { COUNTRIES } from "./countries";

const productKeys = products.map((p) => p.key) as [string, ...string[]];
const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

/**
 * Shared validation for the financing request (client + server action).
 * Error messages are intentionally terse codes — the UI maps them to
 * localized strings so no user-facing text is hard-coded here.
 */
export const applicationSchema = z
  .object({
    // Étape 1 — Projet
    product: z.enum(productKeys),
    country: z.enum(countryCodes),
    amount: z.number({ invalid_type_error: "required" }).positive("required"),
    months: z
      .number({ invalid_type_error: "required" })
      .int()
      .positive("required"),
    purpose: z.string().max(2000).optional().or(z.literal("")),

    // Étape 2 — Identité
    salutation: z.string().optional().or(z.literal("")),
    firstName: z.string().trim().min(1, "required"),
    lastName: z.string().trim().min(1, "required"),
    birthDate: z.string().trim().min(1, "required"),
    nationality: z.string().trim().min(1, "required"),
    nationalId: z.string().trim().max(64).optional().or(z.literal("")),
    addressLine: z.string().trim().min(1, "required"),
    postalCode: z.string().trim().min(1, "required"),
    city: z.string().trim().min(1, "required"),
    phone: z.string().trim().min(1, "required"),
    email: z.string().trim().email("email"),

    // Étape 2 — Situation
    occupation: z.string().trim().min(1, "required"),
    monthlyIncome: z
      .number({ invalid_type_error: "required" })
      .nonnegative("required"),
    monthlyExpenses: z
      .number({ invalid_type_error: "required" })
      .nonnegative("required"),
    housingSituation: z.string().max(500).optional().or(z.literal("")),
    existingCredits: z.string().max(500).optional().or(z.literal("")),

    // Consentements (booléens : les trois premiers doivent être acceptés)
    consentDataProcessing: z.boolean().refine((v) => v === true, "consent"),
    consentAccuracy: z.boolean().refine((v) => v === true, "consent"),
    consentContact: z.boolean().refine((v) => v === true, "consent"),
    consentMarketing: z.boolean(),
  })
  .superRefine((val, ctx) => {
    const product = products.find((p) => p.key === val.product);
    if (!product) return;
    if (val.amount < product.minAmount || val.amount > product.maxAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "amountRange",
      });
    }
    if (val.months < product.minMonths || val.months > product.maxMonths) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["months"],
        message: "durationRange",
      });
    }
  });

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Fields belonging to step 1, used for partial validation before "Next". */
export const STEP1_FIELDS = [
  "product",
  "country",
  "amount",
  "months",
  "purpose",
] as const;
