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
    const adminId = (session.user as { id: string }).id;
    await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id },
        data:  { publishStatus: "published", adminNote: null },
      });
      await tx.propertyImage.updateMany({
        where: { propertyId: id, status: "PENDING" },
        data:  { status: "APPROVED" },
      });

      const existingReview = await tx.verificationCase.findFirst({
        where: { propertyId: id, type: "LISTING_REVIEW" },
        orderBy: { createdAt: "desc" },
      });
      const review = existingReview
        ? await tx.verificationCase.update({
            where: { id: existingReview.id },
            data: {
              status: "APPROVED",
              reviewedById: adminId,
              reviewedAt: new Date(),
              rejectionReason: null,
              suspendedReason: null,
            },
          })
        : await tx.verificationCase.create({
            data: {
              subjectUserId: property.ownerId,
              propertyId: id,
              type: "LISTING_REVIEW",
              status: "APPROVED",
              submittedAt: new Date(),
              reviewedAt: new Date(),
              reviewedById: adminId,
            },
          });
      await tx.verificationAuditLog.create({
        data: {
          verificationCaseId: review.id,
          actorId: adminId,
          action: "LISTING_REVIEW_APPROVED",
          fromStatus: existingReview?.status,
          toStatus: "APPROVED",
          metadata: { propertyId: id },
        },
      });
    });
    const recipient = property.submitter ?? property.owner;
    const firstName = recipient.name?.split(" ")[0] ?? "Propriétaire";
    const email     = recipient.email;
    if (email) await sendPropertyApprovedEmail(email, firstName, property.title);
    return NextResponse.json({ message: "Publié" });
  }

  if (action === "reject") {
    if (!note?.trim()) return NextResponse.json({ error: "Note de refus requise" }, { status: 400 });
    await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id },
        data: { publishStatus: "rejected", adminNote: note },
      });
      const review = await tx.verificationCase.findFirst({
        where: { propertyId: id, type: "LISTING_REVIEW" },
        orderBy: { createdAt: "desc" },
      });
      if (review) {
        await tx.verificationCase.update({
          where: { id: review.id },
          data: {
            status: "REJECTED",
            reviewedById: (session.user as { id: string }).id,
            reviewedAt: new Date(),
            rejectionReason: note.trim(),
          },
        });
        await tx.verificationAuditLog.create({
          data: {
            verificationCaseId: review.id,
            actorId: (session.user as { id: string }).id,
            action: "LISTING_REVIEW_REJECTED",
            fromStatus: review.status,
            toStatus: "REJECTED",
            reason: note.trim(),
            metadata: { propertyId: id },
          },
        });
      }
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
    await prisma.$transaction(async (tx) => {
      await tx.property.update({
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
      await tx.verificationCase.updateMany({
        where: { propertyId: id, type: "LISTING_REVIEW", status: "APPROVED" },
        data: {
          status: "NOT_SUBMITTED",
          reviewedById: null,
          reviewedAt: null,
        },
      });
    });
    return NextResponse.json({ message: "Modifié" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
