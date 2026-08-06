import { NextResponse, type NextRequest } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { renderDocument } from "@/lib/pdf/render";
import {
  getBaseUrl,
  DOCUMENT_LABELS,
  type DocumentPayload,
} from "@/lib/documents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!can(user.role, "applications.view")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const buffer = await renderDocument({
    type: doc.type,
    payload: doc.payload as unknown as DocumentPayload,
    id: doc.id,
    fingerprint: doc.sha256,
    generatedAt: doc.createdAt,
    baseUrl: getBaseUrl(),
  });

  const filename = `${DOCUMENT_LABELS[doc.type].replace(/[^\w]+/g, "-")}-${doc.payload && (doc.payload as unknown as DocumentPayload).reference}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
