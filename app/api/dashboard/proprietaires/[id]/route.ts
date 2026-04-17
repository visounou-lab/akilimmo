import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  const owner = await prisma.user.findUnique({ where: { id } });
  if (!owner) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (action === "activate") {
    await prisma.user.update({ where: { id }, data: { status: "active" } });
    const firstName = owner.name?.split(" ")[0] ?? "Propriétaire";
    if (owner.email) await sendWelcomeEmail(owner.email, firstName);
    return NextResponse.json({ message: "Compte activé" });
  }

  if (action === "suspend") {
    await prisma.user.update({ where: { id }, data: { status: "suspended" } });
    return NextResponse.json({ message: "Compte suspendu" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
