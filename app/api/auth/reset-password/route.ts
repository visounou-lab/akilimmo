import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
    select: { id: true, resetExpires: true },
  });

  if (!user) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (!user.resetExpires || user.resetExpires < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 400 });
  }

  return NextResponse.json({ valid: true });
}

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
    select: { id: true, resetExpires: true },
  });

  if (!user) return NextResponse.json({ error: "Token invalide" }, { status: 400 });
  if (!user.resetExpires || user.resetExpires < new Date()) {
    return NextResponse.json({ error: "Ce lien a expiré" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data:  { password: hashed, resetToken: null, resetExpires: null },
  });

  return NextResponse.json({ message: "Mot de passe modifié avec succès !" });
}
