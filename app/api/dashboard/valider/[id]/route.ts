import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendPropertyApprovedEmail, sendPropertyRejectedEmail } from "@/lib/mailer";
import { uniquePropertySlug } from "@/lib/slug";

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
  const body = await req.json();
  const { action, note } = body;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      submitter: { select: { name: true, email: true } },
      owner:     { select: { name: true, email: true } },
    },
  });
  if (!property) return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });

  if (action === "publish") {
    await prisma.property.update({
      where: { id },
      data:  { publishStatus: "published", adminNote: null },
    });
    const recipient = property.submitter ?? property.owner;
    const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
    const email     = recipient.email;
    if (email) await sendPropertyApprovedEmail(email, firstName, property.title);
    return NextResponse.json({ message: "Publié" });
  }

  if (action === "reject") {
    if (!note?.trim()) return NextResponse.json({ error: "Note de refus requise" }, { status: 400 });
    await prisma.property.update({
      where: { id },
      data:  { publishStatus: "rejected", adminNote: note },
    });
    const recipient = property.submitter ?? property.owner;
    const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
    const email     = recipient.email;
    if (email) await sendPropertyRejectedEmail(email, firstName, property.title, note);
    return NextResponse.json({ message: "Refusé" });
  }

  if (action === "update") {
    const { title, description, country, city, address, price, bedrooms, bathrooms, videoUrl, adminNote } = body;
    const newTitle = title ?? property.title;
    const newCity  = city  ?? property.city;
    const slugData =
      newTitle !== property.title || newCity !== property.city
        ? { slug: await uniquePropertySlug(newTitle, newCity, id) }
        : {};
    await prisma.property.update({
      where: { id },
      data: {
        ...slugData,
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(country     !== undefined && { country }),
        ...(city        !== undefined && { city }),
        ...(address     !== undefined && { address }),
        ...(price       !== undefined && { price: String(price) }),
        ...(bedrooms    !== undefined && { bedrooms: Number(bedrooms) }),
        ...(bathrooms   !== undefined && { bathrooms: Number(bathrooms) }),
        ...(videoUrl    !== undefined && { videoUrl: videoUrl || null }),
        ...(adminNote   !== undefined && { adminNote: adminNote || null }),
      },
    });
    return NextResponse.json({ message: "Modifié" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
