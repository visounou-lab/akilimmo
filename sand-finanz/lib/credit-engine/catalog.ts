import type { CreditProductVersion } from "./types";

/**
 * ============================================================================
 *  CREDIT PARAMETERS — client-provided example values (to confirm with compliance)
 * ============================================================================
 * Amounts, terms and the flat 3 % nominal rate below were provided by SAND
 * FINANZ as the intended product line-up. They remain subject to final
 * compliance/legal sign-off before publication (per the plan's "Exactitude"
 * principle). In production these live in the database (CreditProductVersion)
 * and are edited from the admin; the public calculator and document generation
 * read from the SAME source so results always match.
 * ============================================================================
 */

const COMMON = {
  version: 1,
  country: "DE" as const,
  currency: "EUR" as const,
  minAmount: 5_000,
  minTerm: 12,
  nominalRate: 0.03, // 3 % fixe
  originationFee: null,
  rounding: { unit: 0.01, mode: "nearest" as const },
  activeFrom: "2026-01-01",
  activeTo: null,
  disclaimerKey: "calculator.disclaimer",
};

export const PLACEHOLDER_CATALOG: CreditProductVersion[] = [
  { ...COMMON, id: "de-personal", productType: "personal", maxAmount: 75_000, maxTerm: 84 },
  { ...COMMON, id: "de-auto", productType: "auto", maxAmount: 100_000, maxTerm: 120 },
  { ...COMMON, id: "de-renovation", productType: "renovation", maxAmount: 200_000, maxTerm: 180 },
  { ...COMMON, id: "de-business", productType: "business", maxAmount: 1_000_000, maxTerm: 240 },
  { ...COMMON, id: "de-study", productType: "study", maxAmount: 50_000, maxTerm: 120 },
  { ...COMMON, id: "de-energy", productType: "energy", maxAmount: 150_000, maxTerm: 240 },
];

export function getCatalog(): CreditProductVersion[] {
  return PLACEHOLDER_CATALOG;
}

export function getProductVersion(id: string): CreditProductVersion | undefined {
  return PLACEHOLDER_CATALOG.find((p) => p.id === id);
}
