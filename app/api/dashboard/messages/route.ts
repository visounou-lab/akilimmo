import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendAdminMessageEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { ownerId, subject, body } = await req.json();
  if (!ownerId || !subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }

  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true, name: true, email: true },
  });
  if (!owner) return NextResponse.json({ error: "Propriétaire introuvable" }, { status: 404 });

  await prisma.notification.create({
    data: {
      userId:   owner.id,
      title:    subject,
      body:     body,
      category: "MESSAGE",
    },
  });

  if (owner.email) {
    const firstName = owner.name?.split(" ")[0] ?? "Propriétaire";
    await sendAdminMessageEmail(owner.email, firstName, subject, body);
  }

  return NextResponse.json({ message: "Message envoyé" });
}
