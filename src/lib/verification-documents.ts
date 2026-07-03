import { createHash } from "node:crypto";
import type { VerificationDocumentType, VerificationType } from "@prisma/client";

export const MAX_VERIFICATION_FILE_SIZE = 8 * 1024 * 1024;

export const ALLOWED_DOCUMENTS_BY_CASE: Record<
  Extract<VerificationType, "IDENTITY" | "OWNER_AUTHORITY" | "PROFESSIONAL">,
  VerificationDocumentType[]
> = {
  IDENTITY: ["IDENTITY_DOCUMENT"],
  OWNER_AUTHORITY: ["OWNERSHIP_EVIDENCE", "MANAGEMENT_MANDATE"],
  PROFESSIONAL: [
    "PROFESSIONAL_CARD",
    "BUSINESS_REGISTRATION",
    "TAX_REGISTRATION",
    "PROFESSIONAL_INSURANCE",
  ],
};

export function detectVerificationFile(buffer: Buffer): {
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  extension: "pdf" | "jpg" | "png";
} | null {
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return { mimeType: "application/pdf", extension: "pdf" };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.subarray(0, 8).equals(pngSignature)) {
    return { mimeType: "image/png", extension: "png" };
  }
  return null;
}

export function checksumVerificationFile(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function hasRequiredDocuments(
  type: VerificationType,
  documentTypes: VerificationDocumentType[],
): boolean {
  const available = new Set(documentTypes);
  if (type === "IDENTITY") return available.has("IDENTITY_DOCUMENT");
  if (type === "OWNER_AUTHORITY") {
    return available.has("OWNERSHIP_EVIDENCE") || available.has("MANAGEMENT_MANDATE");
  }
  if (type === "PROFESSIONAL") {
    return available.has("PROFESSIONAL_CARD") || available.has("BUSINESS_REGISTRATION");
  }
  return false;
}
