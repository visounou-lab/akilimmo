// Case-file reference, e.g. "BF-2026-8QK4RW".
// Unambiguous alphabet (no I, L, O, 0, 1). Works in browser and Node.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReference(prefix = "BF", date = new Date()): string {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${date.getFullYear()}-${code}`;
}

const REFERENCE_RE = /^[A-Z]{2}-\d{4}-[A-Z0-9]{4,10}$/;

export function sanitizeReference(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toUpperCase();
  return REFERENCE_RE.test(trimmed) ? trimmed : null;
}
