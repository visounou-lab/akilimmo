const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 100'%3E%3Crect width='160' height='100' fill='%23FDFCF8'/%3E%3Cpath d='M80 22 L48 48 V80 h18 V62 h28 V80 h18 V48 Z' fill='%23C8922A' opacity='0.35'/%3E%3C/svg%3E";

/** Accepts full YouTube URLs, youtu.be short links, embed URLs, or raw 11-char IDs. */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  // Raw 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
  return null;
}

/**
 * Same as getYouTubeId but accepts null/undefined (convenient for nullable DB fields).
 * Also useful as the embed-player helper mentioned in the task.
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  return getYouTubeId(url);
}

/**
 * Returns a YouTube thumbnail URL (hqdefault, always available), or null.
 * Kept for backwards compatibility — existing prod code imports this spelling.
 */
export function getYoutubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Returns maxresdefault thumbnail (1280×720) for a URL or ID, falling back to
 * the neutral SVG placeholder when no valid YouTube ID is found.
 * Use onError in <Image> to swap to hqdefault if maxresdefault is blank.
 */
export function getYouTubeThumbnail(videoUrlOrId: string | null | undefined): string {
  const id = extractYouTubeId(videoUrlOrId);
  if (!id) return PLACEHOLDER_SVG;
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

/**
 * Returns the hqdefault (480×360) thumbnail — always available.
 * Use as the onError fallback when maxresdefault is blank for older videos.
 */
export function getYouTubeThumbnailFallback(videoUrlOrId: string | null | undefined): string {
  const id = extractYouTubeId(videoUrlOrId);
  if (!id) return PLACEHOLDER_SVG;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

type ImageLike = { url: string; status: string; order: number };
type PropertyLike = {
  videoUrl?: string | null;
  imageUrl?: string | null;
  images?: ImageLike[];
};

/**
 * Returns the best display image for a property card:
 * 1. First APPROVED image (sorted by order asc)
 * 2. YouTube thumbnail (maxresdefault) when videoUrl is set
 * 3. Neutral SVG placeholder
 */
export function getPropertyMainImage(property: PropertyLike): string {
  const approved = (property.images ?? [])
    .filter((img) => img.status === "APPROVED")
    .sort((a, b) => a.order - b.order);
  if (approved.length > 0) return approved[0].url;
  return getYouTubeThumbnail(property.videoUrl);
}
