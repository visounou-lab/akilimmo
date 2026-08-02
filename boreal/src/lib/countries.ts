/**
 * Supported countries for a financing request and their currency.
 * The applicant picks a country in step 1; the amount currency follows.
 * Canada is the primary market and the default.
 */
export interface CountryConfig {
  code: string; // ISO-3166 alpha-2
  currency: string; // ISO-4217
}

export const COUNTRIES: CountryConfig[] = [
  { code: "CA", currency: "CAD" },
  { code: "FR", currency: "EUR" },
  { code: "DE", currency: "EUR" },
  { code: "BE", currency: "EUR" },
  { code: "CH", currency: "CHF" },
  { code: "GB", currency: "GBP" },
  { code: "US", currency: "USD" },
];

export const DEFAULT_COUNTRY = "CA";

export function getCountry(code: string): CountryConfig | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function currencyForCountry(code: string): string {
  return getCountry(code)?.currency ?? "CAD";
}
