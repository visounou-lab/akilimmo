export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akilimmo.com";

export function buildPropertyUrl(slug: string): string {
  return `${SITE_URL}/biens/${slug}`;
}

// TODO: add public/og-default.jpg (1200×630) as the OG fallback image
export function ogImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return `${SITE_URL}/og-default.jpg`;
  const uploadMarker = "/upload/";
  const idx = imageUrl.indexOf(uploadMarker);
  if (idx === -1) return imageUrl;
  const transforms = "c_fill,g_auto,w_1200,h_630,q_auto,f_jpg";
  return (
    imageUrl.slice(0, idx + uploadMarker.length) +
    transforms +
    "/" +
    imageUrl.slice(idx + uploadMarker.length)
  );
}

export function formatFCFA(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export function countryLabel(c: string): string {
  if (c === "BENIN") return "Bénin";
  if (c === "COTE_D_IVOIRE") return "Côte d'Ivoire";
  return c;
}
