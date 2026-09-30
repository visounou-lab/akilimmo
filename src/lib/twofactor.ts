import { authenticator } from "otplib";
import QRCode from "qrcode";

// Double authentification (TOTP) — compatible Google Authenticator, Authy,
// Microsoft Authenticator. Utilisé uniquement côté serveur (crypto Node).
const ISSUER = "AKIL IMMO";

// Tolérance d'une fenêtre de 30 s avant/après pour absorber une petite dérive
// d'horloge entre le téléphone et le serveur.
authenticator.options = { window: 1 };

/** Génère un nouveau secret TOTP (base32) à stocker sur le compte. */
export function generateTwoFactorSecret(): string {
  return authenticator.generateSecret();
}

/** URL otpauth:// à encoder dans le QR d'enrôlement. */
export function twoFactorKeyUri(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret);
}

/** QR d'enrôlement sous forme de data URL (image PNG) à afficher. */
export function twoFactorQrDataUrl(email: string, secret: string): Promise<string> {
  return QRCode.toDataURL(twoFactorKeyUri(email, secret));
}

/** Vérifie un code à 6 chiffres saisi par l'utilisateur contre son secret. */
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  try {
    return authenticator.verify({ token: token.replace(/\D/g, ""), secret });
  } catch {
    return false;
  }
}
