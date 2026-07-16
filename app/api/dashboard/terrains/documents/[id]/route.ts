import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { privateVerificationDocumentUrl } from "@/lib/cloudinary";

const EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Génère un lien de téléchargement signé et éphémère (5 min) pour un document
// privé rattaché à un terrain. Réservé aux administrateurs.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { id } = await params;
  const doc = await prisma.landDocument.findUnique({
    where: { id },
    select: { storageKey: true, mimeType: true },
  });
  if (!doc) return NextResponse.json({ error: "Document introuvable" }, { status: 404 });

  const format = EXT_BY_MIME[doc.mimeType ?? ""] ?? "pdf";
  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;
  const url = privateVerificationDocumentUrl(doc.storageKey, format, expiresAt);

  return NextResponse.json({ url });
}
