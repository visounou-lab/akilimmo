import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  Car,
  Hammer,
  Layers,
  Briefcase,
  Rocket,
} from "lucide-react";

export interface FinancingProduct {
  /** Stable key + URL slug, and i18n message key under `products.items`. */
  key: string;
  icon: LucideIcon;
  /** Indicative range used by the simulator, in CAD. */
  minAmount: number;
  maxAmount: number;
  /** Term range in months. */
  minMonths: number;
  maxMonths: number;
  /** Indicative starting annual rate (percent). Never guaranteed. */
  fromRate: number;
}

export const products: FinancingProduct[] = [
  {
    key: "personal",
    icon: Wallet,
    minAmount: 1000,
    maxAmount: 50000,
    minMonths: 6,
    maxMonths: 84,
    fromRate: 3,
  },
  {
    key: "auto",
    icon: Car,
    minAmount: 5000,
    maxAmount: 125000,
    minMonths: 12,
    maxMonths: 96,
    fromRate: 3.5,
  },
  {
    key: "renovation",
    icon: Hammer,
    minAmount: 2000,
    maxAmount: 100000,
    minMonths: 12,
    maxMonths: 120,
    fromRate: 3.9,
  },
  {
    key: "consolidation",
    icon: Layers,
    minAmount: 5000,
    maxAmount: 75000,
    minMonths: 12,
    maxMonths: 96,
    fromRate: 4.5,
  },
  {
    key: "business",
    icon: Briefcase,
    minAmount: 10000,
    maxAmount: 500000,
    minMonths: 12,
    maxMonths: 120,
    fromRate: 4.9,
  },
  {
    key: "project",
    icon: Rocket,
    minAmount: 5000,
    maxAmount: 250000,
    minMonths: 12,
    maxMonths: 120,
    fromRate: 4.5,
  },
];

export function getProduct(key: string): FinancingProduct | undefined {
  return products.find((p) => p.key === key);
}
