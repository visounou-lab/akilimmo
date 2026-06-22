import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      variant: true,
      color: true,
      seats: true,
      fuel: true,
      features: true,
      priceDay: true,
      priceLong: true,
      imageUrl: true,
      images: true,
      available: true,
      city: true,
      country: true,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
  }

  const allImages =
    vehicle.images.length > 0
      ? vehicle.images
      : vehicle.imageUrl
      ? [vehicle.imageUrl]
      : [];

  return NextResponse.json({ ...vehicle, allImages });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyMobileToken(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name, variant, color, seats, fuel, features,
    priceDay, priceLong, images, available, city, country,
  } = body;

  const imageList: string[] | undefined =
    Array.isArray(images) ? images.filter(Boolean) : undefined;

  const updated = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      ...(name      != null && { name }),
      ...(variant   != null && { variant }),
      ...(color     != null && { color }),
      ...(seats     != null && { seats: Number(seats) }),
      ...(fuel      != null && { fuel }),
      ...(features  != null && { features: Array.isArray(features) ? features : [] }),
      ...(priceDay  != null && { priceDay:  Number(priceDay) }),
      ...(priceLong != null && { priceLong: Number(priceLong) }),
      ...(imageList          && { images: imageList, imageUrl: imageList[0] ?? null }),
      ...(available != null  && { available: Boolean(available) }),
      ...(city      != null  && { city }),
      ...(country   != null  && { country }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyMobileToken(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
