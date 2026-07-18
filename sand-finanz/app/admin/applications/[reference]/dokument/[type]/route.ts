import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { writeAudit } from "@/lib/audit";
import { generateDocument } from "@/lib/pdf/generate";
import type { DocType } from "@/lib/pdf/token";

const TYPES: DocType[] = ["anmeldeformular", "tilgungsplan", "vertrag", "einlagenzertifikat"];

function requestOrigin(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

export async function GET(
  req: Request,
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

  const doc = await generateDocument(reference, type as DocType, requestOrigin(req));
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
