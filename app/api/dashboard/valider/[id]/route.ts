import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPropertyApprovedEmail, sendPropertyRejectedEmail } from "@/lib/mailer";

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
  const { action, note } = await req.json();

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      submitter: { select: { name: true, email: true } },
      owner:     { select: { name: true, email: true } },
    },
  });
  if (!property) return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });

  const recipient = property.submitter ?? property.owner;
  const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
  const email     = recipient.email;

  if (action === "publish") {
    await prisma.property.update({
      where: { id },
      data:  { publishStatus: "published", adminNote: null },
    });
    if (email) await sendPropertyApprovedEmail(email, firstName, property.title);
    return NextResponse.json({ message: "Publié" });
  }

  if (action === "reject") {
    if (!note?.trim()) return NextResponse.json({ error: "Note de refus requise" }, { status: 400 });
    await prisma.property.update({
      where: { id },
      data:  { publishStatus: "rejected", adminNote: note },
    });
    if (email) await sendPropertyRejectedEmail(email, firstName, property.title, note);
    return NextResponse.json({ message: "Refusé" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
