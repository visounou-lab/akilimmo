import { NextResponse } from "next/server";
import { verifyDocToken } from "@/lib/pdf/token";
import { generateDocument } from "@/lib/pdf/generate";
import { writeAudit } from "@/lib/audit";

/**
 * Public electronic access to a document via the signed token embedded in the
 * QR code. The unguessable token is the access control; no login required.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const payload = await verifyDocToken(token);
  if (!payload) return NextResponse.json({ error: "invalid_or_expired" }, { status: 401 });

  const doc = await generateDocument(payload.ref, payload.type);
  if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await writeAudit({ action: "document.accessed_online", entity: "Application", entityId: payload.ref, metadata: { type: payload.type } });

  return new NextResponse(new Uint8Array(doc.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.filename}"`,
    },
  });
}
