import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const requests = await prisma.reservationRequest.findMany({
    where: { property: { ownerId: user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      clientName: true,
      clientPhone: true,
      checkIn: true,
      checkOut: true,
      duration: true,
      totalPrice: true,
      status: true,
      message: true,
      createdAt: true,
      property: { select: { id: true, title: true, city: true } },
    },
  });

  return NextResponse.json(
    requests.map((r) => ({
      ...r,
      checkIn: r.checkIn.toISOString(),
      checkOut: r.checkOut.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }))
  );
}
