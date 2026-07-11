/**
 * Normalisation des données servies à l'application mobile.
 *
 * `propertyType` est un champ texte libre en base : selon la personne qui
 * a saisi le bien, on y trouve des variantes françaises ou anglaises
 * (« appartement » vs « apartment »). L'application mobile filtre sur des
 * clés canoniques anglaises — on normalise donc à la lecture pour que
 * chaque bien reste filtrable, sans dépendre de la discipline de saisie.
 */

const PROPERTY_TYPE_MAP: Record<string, string> = {
  apartment: "apartment",
  appartement: "apartment",
  appart: "apartment",
  villa: "villa",
  house: "house",
  maison: "house",
  studio: "studio",
  chambre: "studio",
  bureau: "office",
  office: "office",
};

export function normalizePropertyType(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return PROPERTY_TYPE_MAP[key] ?? key;
}

/**
 * Variantes brutes connues d'un type canonique, pour filtrer en base
 * des valeurs saisies librement (ex. "apartment" → ["apartment", "appartement", "appart"]).
 */
export function propertyTypeVariants(canonical: string): string[] {
  const key = canonical.trim().toLowerCase();
  const variants = Object.entries(PROPERTY_TYPE_MAP)
    .filter(([, canon]) => canon === key)
    .map(([raw]) => raw);
  return variants.length > 0 ? variants : [key];
}

/** Supprime les espaces parasites en début/fin (titres, villes saisis à la main). */
export function cleanText<T extends string | null | undefined>(raw: T): T {
  return (typeof raw === "string" ? raw.trim() : raw) as T;
}

/**
 * Ramène le type de séjour aux deux valeurs canoniques du schéma.
 * Toute valeur inattendue retombe sur "long" (le défaut Prisma).
 */
export function normalizeStayType(raw: unknown): "short" | "long" {
  const key = String(raw ?? "").trim().toLowerCase();
  return key === "short" || key.startsWith("court") ? "short" : "long";
}
