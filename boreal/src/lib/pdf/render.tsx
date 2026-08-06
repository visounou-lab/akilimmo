import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import type { DocumentType } from "@prisma/client";

import type { DocumentPayload } from "@/lib/documents";
import { ScheduleDocument } from "./documents/schedule";
import { RegistrationDocument } from "./documents/registration";

export async function renderDocument({
  type,
  payload,
  id,
  fingerprint,
  generatedAt,
  baseUrl,
}: {
  type: DocumentType;
  payload: DocumentPayload;
  id: string;
  fingerprint: string;
  generatedAt: Date;
  baseUrl: string;
}): Promise<Buffer> {
  const verifyUrl = `${baseUrl}/verify/${id}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 220 });
  const props = { payload, verifyUrl, fingerprint, qrDataUrl, generatedAt };

  switch (type) {
    case "SCHEDULE":
      return renderToBuffer(<ScheduleDocument {...props} />);
    case "REGISTRATION":
      return renderToBuffer(<RegistrationDocument {...props} />);
    default:
      throw new Error(`Type de document non pris en charge : ${type}`);
  }
}
