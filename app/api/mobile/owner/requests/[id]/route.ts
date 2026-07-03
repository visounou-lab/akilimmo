import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { status } = await req.json();
  if (!["confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  // Verify the request belongs to one of the owner's properties
  const request = await prisma.reservationRequest.findFirst({
    where: { id, property: { ownerId: user.id } },
  });

  if (!request) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  const updated = await prisma.reservationRequest.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}
