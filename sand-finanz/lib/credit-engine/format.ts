import type { Currency } from "./types";

/** Locale-aware currency formatting driven by the dossier locale. */
export function formatMoney(amount: number, currency: Currency, bcp47: string): string {
  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Formats a decimal rate (0.069) as a localised percentage ("6,9 %"). */
export function formatPercent(rate: number, bcp47: string): string {
  return new Intl.NumberFormat(bcp47, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(rate);
}
