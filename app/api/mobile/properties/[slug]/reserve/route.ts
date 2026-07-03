import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { clientName, clientPhone, checkIn, checkOut, duration, totalPrice, message, locationType } = await req.json();

    if (!clientName || !clientPhone || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Informations manquantes" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { slug, publishStatus: "published" },
      select: { id: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    }

    const request = await prisma.reservationRequest.create({
      data: {
        propertyId:  property.id,
        clientName:  clientName.trim(),
        clientPhone: clientPhone.trim(),
        checkIn:     new Date(checkIn),
        checkOut:    new Date(checkOut),
        duration:    duration ?? 1,
        totalPrice:  totalPrice ?? 0,
        message:     message?.trim() || null,
        locationType: locationType ?? "short_term",
        status:      "pending",
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, requestId: request.id });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
