import type { CreditProductVersion } from "./types";

/**
 * ============================================================================
 *  PLACEHOLDER CREDIT PARAMETERS — NOT REAL SAND FINANZ OFFERS
 * ============================================================================
 * Every value below (amounts, terms, rates, fees, product availability) is an
 * EXAMPLE used only to make the calculator functional in staging. None of it
 * may be published as a real offer. Before production, each version must be
 * replaced with figures validated by SAND FINANZ compliance/legal, per the
 * plan's non-negotiable "Exactitude" principle.
 *
 * In a later batch these versions move to the database (CreditProductVersion
 * table) and are edited from the admin back-office. The public calculator and
 * document generation read from the SAME source so results always match.
 * ============================================================================
 */

export const PLACEHOLDER_CATALOG: CreditProductVersion[] = [
  {
    id: "de-personal",
    version: 1,
    country: "DE",
    productType: "personal",
    currency: "EUR",
    minAmount: 2_000,
    maxAmount: 50_000,
    minTerm: 12,
    maxTerm: 84,
    nominalRate: 0.069, // EXAMPLE 6.9 % — to validate
    originationFee: null,
    rounding: { unit: 0.01, mode: "nearest" },
    activeFrom: "2026-01-01",
    activeTo: null,
    disclaimerKey: "calculator.disclaimer",
  },
  {
    id: "de-auto",
    version: 1,
    country: "DE",
    productType: "auto",
    currency: "EUR",
    minAmount: 3_000,
    maxAmount: 80_000,
    minTerm: 12,
    maxTerm: 96,
    nominalRate: 0.049, // EXAMPLE 4.9 % — to validate
    originationFee: null,
    rounding: { unit: 0.01, mode: "nearest" },
    activeFrom: "2026-01-01",
    activeTo: null,
    disclaimerKey: "calculator.disclaimer",
  },
  {
    id: "de-renovation",
    version: 1,
    country: "DE",
    productType: "renovation",
    currency: "EUR",
    minAmount: 5_000,
    maxAmount: 100_000,
    minTerm: 24,
    maxTerm: 120,
    nominalRate: 0.059, // EXAMPLE 5.9 % — to validate
    originationFee: null,
    rounding: { unit: 0.01, mode: "nearest" },
    activeFrom: "2026-01-01",
    activeTo: null,
    disclaimerKey: "calculator.disclaimer",
  },
];

export function getCatalog(): CreditProductVersion[] {
  return PLACEHOLDER_CATALOG;
}

export function getProductVersion(id: string): CreditProductVersion | undefined {
  return PLACEHOLDER_CATALOG.find((p) => p.id === id);
}
