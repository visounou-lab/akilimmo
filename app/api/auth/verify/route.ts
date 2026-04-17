import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { verifyToken: token } });

  if (!user) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (user.verifyExpires && user.verifyExpires < new Date()) {
    return NextResponse.json({ error: "expired", email: user.email }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      emailVerified: new Date(),
      verifyToken: null,
      verifyExpires: null,
    },
  });

  return NextResponse.json({ message: "ok" });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isVerified) {
    return NextResponse.json({ error: "Compte introuvable ou déjà vérifié" }, { status: 400 });
  }

  const verifyToken = crypto.randomUUID();
  const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken, verifyExpires },
  });

  await sendVerificationEmail(email, verifyToken);
  return NextResponse.json({ message: "Lien renvoyé" });
}
