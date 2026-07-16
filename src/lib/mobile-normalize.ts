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

/** Libellés français propres par type canonique, pour un affichage cohérent. */
const PROPERTY_TYPE_LABELS_FR: Record<string, string> = {
  apartment: "Appartement",
  villa: "Villa",
  house: "Maison",
  studio: "Studio",
  office: "Bureau",
};

/**
 * Libellé français affichable d'un type de bien, quelle que soit la variante
 * saisie en base ("apartment" comme "appartement" → "Appartement").
 */
export function propertyTypeLabel(raw: string | null | undefined): string | null {
  const canonical = normalizePropertyType(raw);
  if (!canonical) return null;
  return (
    PROPERTY_TYPE_LABELS_FR[canonical] ??
    canonical.charAt(0).toUpperCase() + canonical.slice(1)
  );
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
