import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDocumentRequest } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; name?: string | null; email?: string | null } | undefined;

  if (!user?.id || user.role !== "OWNER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { type?: string; propertyId?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { type, propertyId, message } = body;

  const VALID_TYPES = ["quittance", "contrat", "attestation"];
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Type de document invalide" }, { status: 422 });
  }

  // Verify property belongs to this owner (if provided)
  let propertyTitle: string | undefined;
  if (propertyId) {
    const prop = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: user.id },
      select: { title: true },
    });
    if (!prop) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }
    propertyTitle = prop.title;
  }

  const docRequest = await prisma.documentRequest.create({
    data: {
      ownerId:    user.id,
      type,
      status:     "pending",
      propertyId: propertyId ?? null,
      message:    message?.trim() || null,
    },
  });

  try {
    await sendDocumentRequest({
      ownerName:     user.name ?? "Propriétaire",
      ownerEmail:    user.email ?? "",
      type,
      propertyTitle,
      message:       message?.trim(),
      requestId:     docRequest.id,
    });
  } catch (err) {
    console.error("[/api/owner/documents] email failed", err);
    // Don't fail the request — the DB record is created
  }

  return NextResponse.json({ id: docRequest.id }, { status: 201 });
}
