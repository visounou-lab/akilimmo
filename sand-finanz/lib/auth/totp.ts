import { authenticator } from "otplib";

// A little clock drift tolerance for authenticator apps.
authenticator.options = { window: 1 };

const ISSUER = "SAND FINANZ GRUPPE";

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function totpAuthUri(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret);
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token: token.replace(/\s/g, ""), secret });
  } catch {
    return false;
  }
}
