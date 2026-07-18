import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { writeAudit } from "@/lib/audit";
import { generateDocument } from "@/lib/pdf/generate";
import type { DocType } from "@/lib/pdf/token";

const TYPES: DocType[] = ["anmeldeformular", "tilgungsplan", "vertrag", "einlagenzertifikat"];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ reference: string; type: string }> },
) {
  const { reference, type } = await params;
  if (!TYPES.includes(type as DocType)) {
    return NextResponse.json({ error: "unknown_type" }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user || !can(user.role, "documents.generate")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const doc = await generateDocument(reference, type as DocType);
  if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await writeAudit({
    actorId: user.id,
    action: "document.generated",
    entity: "Application",
    entityId: reference,
    metadata: { type, sha256: doc.sha256 },
  });

  return new NextResponse(new Uint8Array(doc.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.filename}"`,
      "X-Document-Sha256": doc.sha256,
    },
  });
}
