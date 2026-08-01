import { Resend } from "resend";

/**
 * Lazily-constructed Resend client. Returns null when unconfigured so Phase 1
 * (public site + simulator) builds and runs without any email credentials.
 * Wired to transactional emails (accusé de réception, etc.) in a later phase.
 */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}
