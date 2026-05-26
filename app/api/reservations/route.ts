import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewReservationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { propertyId, clientName, clientPhone, checkIn, checkOut, locationType, duration, totalPrice, message } =
    body as {
      propertyId:   string;
      clientName:   string;
      clientPhone:  string;
      checkIn:      string;
      checkOut:     string;
      locationType: string;
      duration:     number;
      totalPrice:   number;
      message?:     string;
    };

  if (!propertyId || !clientName?.trim() || !clientPhone?.trim() || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservationRequest.create({
      data: {
        propertyId,
        clientName:   clientName.trim(),
        clientPhone:  clientPhone.trim(),
        checkIn:      new Date(checkIn),
        checkOut:     new Date(checkOut),
        locationType,
        duration:     Number(duration),
        totalPrice:   Number(totalPrice),
        message:      message?.trim() || null,
        status:       "pending",
      },
      include: { property: { select: { title: true, city: true } } },
    });

    const admins = await prisma.user.findMany({
      where:  { role: "ADMIN" },
      select: { id: true },
    });

    if (admins.length > 0) {
      const checkInFmt = new Date(checkIn).toLocaleDateString("fr-FR");
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId:     admin.id,
          title:      `Réservation — ${reservation.property.title}`,
          body:       `${clientName.trim()} · ${duration} ${locationType}${duration > 1 ? "s" : ""} à partir du ${checkInFmt} · ${new Intl.NumberFormat("fr-FR").format(Number(totalPrice))} FCFA`,
          category:   "BOOKING" as const,
          actionUrl:  "/dashboard/reservations",
          propertyId,
        })),
      });
    }

    // Fire-and-forget email — ne bloque pas la réponse
    sendNewReservationEmail({
      clientName:    clientName.trim(),
      clientPhone:   clientPhone.trim(),
      propertyTitle: reservation.property.title,
      propertyCity:  reservation.property.city,
      checkIn:       new Date(checkIn),
      checkOut:      new Date(checkOut),
      duration:      Number(duration),
      locationType,
      totalPrice:    Number(totalPrice),
      message:       message?.trim() || null,
      reservationId: reservation.id,
    }).catch((e) => console.error("[reservation email]", e));

    return NextResponse.json({ ok: true, id: reservation.id });
  } catch (err) {
    console.error("[/api/reservations] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
