import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ALLOWED_STATUS = ["pending", "contacted", "closed"] as const;

export async function PATCH(
  req: NextRequest,
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
  const { status } = await req.json();
  if (!ALLOWED_STATUS.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const inquiry = await prisma.landInquiry.findUnique({ where: { id }, select: { id: true } });
  if (!inquiry) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });

  await prisma.landInquiry.update({ where: { id }, data: { status } });
  return NextResponse.json({ message: "Mis à jour" });
}
