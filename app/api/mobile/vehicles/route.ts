import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  const isAdmin = user?.role === "ADMIN";

  const city = req.nextUrl.searchParams.get("city") ?? undefined;

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(isAdmin ? {} : { available: true }),
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      variant: true,
      color: true,
      seats: true,
      fuel: true,
      priceDay: true,
      priceLong: true,
      imageUrl: true,
      images: true,
      available: true,
      city: true,
      country: true,
    },
  });

  return NextResponse.json(
    vehicles.map((v) => ({
      ...v,
      coverImage: v.images.length > 0 ? v.images[0] : (v.imageUrl ?? null),
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name, variant, color, seats, fuel, features,
    priceDay, priceLong, images, available, city, country,
  } = body;

  if (!name || !color || priceDay == null || priceLong == null) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const imageList: string[] = Array.isArray(images) ? images.filter(Boolean) : [];

  const vehicle = await prisma.vehicle.create({
    data: {
      name,
      variant:   variant  || "SUV",
      color,
      seats:     Number(seats)    || 5,
      fuel:      fuel     || "Essence · Automatique",
      features:  Array.isArray(features) ? features : [],
      priceDay:  Number(priceDay),
      priceLong: Number(priceLong),
      imageUrl:  imageList[0] ?? null,
      images:    imageList,
      available: available !== false,
      city:      city    || "Abidjan",
      country:   country || "COTE_D_IVOIRE",
    },
  });

  return NextResponse.json(vehicle, { status: 201 });
}
