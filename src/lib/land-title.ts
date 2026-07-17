// Helpers partagés autour de la vérification du titre d'un terrain.

export const LAND_TITLE_LABELS: Record<string, string> = {
  TITRE_FONCIER: "Titre foncier",
  ACD: "ACD (Attestation de Cession Définitive)",
  LETTRE_ATTRIBUTION: "Lettre d'attribution",
  CONVENTION_VENTE: "Convention de vente",
  AUTRE: "Autre",
};

/**
 * Masque partiellement la référence du titre : prouve qu'AKIL IMMO la détient
 * sans exposer publiquement le numéro complet.
 */
export function maskTitleRef(ref: string): string {
  const trimmed = ref.trim();
  if (trimmed.length <= 4) return trimmed;
  const head = trimmed.slice(0, Math.min(4, trimmed.length - 2));
  return `${head}${"•".repeat(Math.max(2, trimmed.length - head.length - 1))}${trimmed.slice(-1)}`;
}

/** Référence lisible et stable d'un certificat, dérivée de l'id du terrain. */
export function certificateRef(landId: string): string {
  return `AKIL-${landId.slice(-8).toUpperCase()}`;
}
