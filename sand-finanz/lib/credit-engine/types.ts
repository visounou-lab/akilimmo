export type Country = "DE" | "PL" | "SE" | "CZ";

export type ProductType =
  | "personal"
  | "auto"
  | "renovation"
  | "business"
  | "study"
  | "energy";

export type Currency = "EUR" | "PLN" | "SEK" | "CZK";

export type FeeType = "fixed" | "percent";

export interface OriginationFee {
  type: FeeType;
  /** For "fixed": an amount in the product currency. For "percent": a decimal, e.g. 0.01 = 1 %. */
  value: number;
}

export interface RoundingRule {
  /** Smallest monetary unit for displayed monthly payments, e.g. 1 or 0.01. */
  unit: number;
  mode: "nearest" | "up" | "down";
}

/**
 * A versioned set of credit parameters. This is the single source of truth used
 * by the public calculator, generated offers and contracts. A version is
 * immutable once attached to an offer so later parameter changes never alter a
 * historical file.
 */
export interface CreditProductVersion {
  id: string;
  version: number;
  country: Country;
  productType: ProductType;
  currency: Currency;
  minAmount: number;
  maxAmount: number;
  /** Term bounds in months. */
  minTerm: number;
  maxTerm: number;
  /** Annual nominal rate as a decimal, e.g. 0.069 = 6.9 %. */
  nominalRate: number;
  /**
   * Effective annual rate (APR / TAEG) as a decimal, if validated and entered
   * manually. When omitted the engine computes an indicative value.
   */
  effectiveRate?: number;
  originationFee: OriginationFee | null;
  rounding: RoundingRule;
  activeFrom: string;
  activeTo?: string | null;
  /** i18n key for the localised legal disclaimer shown with any result. */
  disclaimerKey: string;
}

export interface CalculationInput {
  principal: number;
  termMonths: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface CalculationResult {
  currency: Currency;
  principal: number;
  termMonths: number;
  nominalRate: number;
  /** Effective annual rate actually used (validated value or indicative estimate). */
  effectiveRate: number;
  effectiveRateIsIndicative: boolean;
  monthlyPayment: number;
  originationFee: number;
  totalInterest: number;
  /** Sum of all monthly payments (interest + principal). */
  totalRepayment: number;
  /** Total cost of credit = interest + fees. */
  totalCost: number;
  schedule: AmortizationRow[];
  disclaimerKey: string;
}

export type ValidationErrorCode =
  | "AMOUNT_TOO_LOW"
  | "AMOUNT_TOO_HIGH"
  | "TERM_TOO_SHORT"
  | "TERM_TOO_LONG"
  | "INVALID_NUMBER";

export interface ValidationError {
  code: ValidationErrorCode;
  field: "principal" | "termMonths";
  limit?: number;
}
