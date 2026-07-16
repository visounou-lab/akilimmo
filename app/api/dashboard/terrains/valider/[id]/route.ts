import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendLandApprovedEmail, sendLandRejectedEmail } from "@/lib/mailer";
import { uniqueLandSlug } from "@/lib/slug";

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

  const land = await prisma.land.findUnique({
    where: { id },
    include: {
      submitter: { select: { name: true, email: true } },
      owner:     { select: { name: true, email: true } },
    },
  });
  if (!land) return NextResponse.json({ error: "Terrain introuvable" }, { status: 404 });

  if (action === "publish") {
    await prisma.land.update({
      where: { id },
      data:  { publishStatus: "published", adminNote: null },
    });
    const recipient = land.submitter ?? land.owner;
    const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
    if (recipient.email) await sendLandApprovedEmail(recipient.email, firstName, land.title);
    return NextResponse.json({ message: "Publié" });
  }

  if (action === "reject") {
    if (!note?.trim()) return NextResponse.json({ error: "Note de refus requise" }, { status: 400 });
    await prisma.land.update({
      where: { id },
      data:  { publishStatus: "rejected", adminNote: note.trim() },
    });
    const recipient = land.submitter ?? land.owner;
    const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
    if (recipient.email) await sendLandRejectedEmail(recipient.email, firstName, land.title, note.trim());
    return NextResponse.json({ message: "Refusé" });
  }

  if (action === "update") {
    const { title, description, country, city, address, price, surface, titleType, serviced, videoUrl, adminNote } = body;
    const newTitle = title ?? land.title;
    const newCity  = city  ?? land.city;
    const slugData =
      newTitle !== land.title || newCity !== land.city
        ? { slug: await uniqueLandSlug(newTitle, newCity, id) }
        : {};
    await prisma.land.update({
      where: { id },
      data: {
        ...slugData,
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(country     !== undefined && { country }),
        ...(city        !== undefined && { city }),
        ...(address     !== undefined && { address }),
        ...(price       !== undefined && { price: String(price) }),
        ...(surface     !== undefined && { surface: Number(surface) }),
        ...(titleType   !== undefined && { titleType }),
        ...(serviced    !== undefined && { serviced: Boolean(serviced) }),
        ...(videoUrl    !== undefined && { videoUrl: videoUrl || null }),
        ...(adminNote   !== undefined && { adminNote: adminNote || null }),
      },
    });
    return NextResponse.json({ message: "Modifié" });
  }

  if (action === "verify_title") {
    const adminId = (session.user as { id: string }).id;
    const ref  = (body.titleRef as string | undefined)?.trim() || land.titleRef || null;
    const note = (body.note as string | undefined)?.trim() || null;
    await prisma.land.update({
      where: { id },
      data: {
        titleVerification:     "VERIFIED",
        titleRef:              ref,
        titleVerificationNote: note,
        titleVerifiedAt:       new Date(),
        titleVerifiedById:     adminId,
      },
    });
    return NextResponse.json({ message: "Titre vérifié" });
  }

  if (action === "reject_title") {
    const note = (body.note as string | undefined)?.trim() || null;
    await prisma.land.update({
      where: { id },
      data: {
        titleVerification:     "REJECTED",
        titleVerificationNote: note,
        titleVerifiedAt:       new Date(),
        titleVerifiedById:     (session.user as { id: string }).id,
      },
    });
    return NextResponse.json({ message: "Titre rejeté" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
