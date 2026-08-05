// French labels for the (French-only) back-office.

export const PRODUCT_LABELS: Record<string, string> = {
  personal: "Prêt personnel",
  auto: "Financement automobile",
  renovation: "Prêt rénovation",
  consolidation: "Regroupement de dettes",
  business: "Financement professionnel",
  project: "Financement de projet",
};

export const COUNTRY_LABELS: Record<string, string> = {
  CA: "Canada",
  FR: "France",
  DE: "Allemagne",
  BE: "Belgique",
  CH: "Suisse",
  GB: "Royaume-Uni",
  US: "États-Unis",
};

export function productLabel(key: string): string {
  return PRODUCT_LABELS[key] ?? key;
}

export function countryLabel(code: string): string {
  return COUNTRY_LABELS[code] ?? code;
}
