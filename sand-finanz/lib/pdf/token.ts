import { SignJWT, jwtVerify } from "jose";
import QRCode from "qrcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function secret(): Uint8Array {
  const v = process.env.AUTH_SECRET;
  if (!v || v.length < 16) throw new Error("AUTH_SECRET missing/too short");
  return new TextEncoder().encode(v);
}

export type DocType = "anmeldeformular" | "tilgungsplan" | "vertrag" | "einlagenzertifikat";

/** Signs an unguessable access token for a document (personal data → not a plain URL). */
export async function signDocToken(reference: string, type: DocType): Promise<string> {
  return new SignJWT({ ref: reference, type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secret());
}

export async function verifyDocToken(token: string): Promise<{ ref: string; type: DocType } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.ref === "string" && typeof payload.type === "string") {
      return { ref: payload.ref, type: payload.type as DocType };
    }
    return null;
  } catch {
    return null;
  }
}

export function accessUrl(token: string): string {
  return `${SITE_URL}/dokument/${token}`;
}

/** Returns a PNG data URL for a QR code that links to the online document. */
export async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 0, width: 240, errorCorrectionLevel: "M" });
}
