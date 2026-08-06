import "server-only";
import { createHash } from "node:crypto";
import type { Application, CompanySettings, DocumentType } from "@prisma/client";

import { buildSchedule } from "@/lib/finance";
import { productLabel, countryLabel } from "@/lib/admin/labels";

/** French labels for every document type. */
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  ACKNOWLEDGEMENT: "Accusé de réception",
  DOCUMENTS_REQUEST: "Demande de pièces",
  SUMMARY: "Récapitulatif",
  REGISTRATION: "Formulaire d'inscription",
  INDICATIVE_PROPOSAL: "Proposition indicative",
  SCHEDULE: "Tableau d'amortissement",
  CONTRACT: "Contrat de prêt",
  DEPOSIT_CERTIFICATE: "Certificat de dépôt",
  ACCEPTANCE: "Acceptation",
  REJECTION: "Refus",
  CANCELLATION: "Annulation",
  CLOSURE: "Clôture",
};

/** Document types that are implemented and offered in the UI. */
export const AVAILABLE_DOCUMENT_TYPES: DocumentType[] = ["SCHEDULE", "REGISTRATION"];

/** Snapshot stored with each generated document, for deterministic re-rendering. */
export interface DocumentPayload {
  reference: string;
  company: {
    legalName: string;
    addressLine: string;
    postalCode: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    registerNumber: string;
    website: string;
  };
  applicant: {
    salutation: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationality: string;
    nationalId: string;
    address: string;
    phone: string;
    email: string;
    occupation: string;
    housing: string;
    existingCredits: string;
    monthlyIncome: number;
  };
  loan: {
    product: string;
    productLabel: string;
    country: string;
    countryLabel: string;
    currency: string;
    amount: number;
    months: number;
    annualRate: number;
    monthlyPayment: number;
    totalCost: number;
    purpose: string;
  };
  schedule: {
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

const SALUTATIONS: Record<string, string> = { mr: "M.", mrs: "Mme", other: "Autre" };

export function buildDocumentPayload(
  app: Application,
  settings: CompanySettings | null,
): DocumentPayload {
  const ph = (v: string | null | undefined, placeholder: string) =>
    (v && v.trim()) || placeholder;

  return {
    reference: app.reference,
    company: {
      legalName: ph(settings?.legalName, "[Raison sociale — à compléter]"),
      addressLine: ph(settings?.addressLine, "[Adresse — à compléter]"),
      postalCode: settings?.postalCode ?? "",
      city: settings?.city ?? "",
      country: ph(settings?.country, "[Pays — à compléter]"),
      email: ph(settings?.email, "[Courriel — à compléter]"),
      phone: settings?.phone ?? "",
      registerNumber: ph(settings?.registerNumber, "[N° d'enregistrement — à compléter]"),
      website: settings?.website ?? "borealfinanx.com",
    },
    applicant: {
      salutation: app.salutation ? (SALUTATIONS[app.salutation] ?? "") : "",
      firstName: app.firstName,
      lastName: app.lastName,
      birthDate: app.birthDate ? app.birthDate.toISOString().slice(0, 10) : "—",
      nationality: app.nationality ?? "—",
      nationalId: app.nationalId ?? "—",
      address: [app.addressLine, app.postalCode, app.city].filter(Boolean).join(", ") || "—",
      phone: app.phone,
      email: app.email,
      occupation: app.occupation ?? "—",
      housing: app.housingSituation ?? "—",
      existingCredits: app.existingCredits ?? "—",
      monthlyIncome: app.monthlyIncome,
    },
    loan: {
      product: app.product,
      productLabel: productLabel(app.product),
      country: app.country,
      countryLabel: countryLabel(app.country),
      currency: app.currency,
      amount: app.amount,
      months: app.months,
      annualRate: app.annualRate,
      monthlyPayment: app.monthlyPayment,
      totalCost: app.totalCost,
      purpose: app.purpose ?? "—",
    },
    schedule: buildSchedule({
      amount: app.amount,
      months: app.months,
      annualRate: app.annualRate,
    }),
  };
}

/** Deterministic SHA-256 over the canonical payload. */
export function documentFingerprint(payload: DocumentPayload): string {
  return createHash("sha256").update(stableStringify(payload)).digest("hex");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    return `{${keys
      .map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
