import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPropertyMainImage } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const city     = req.nextUrl.searchParams.get("city")     ?? undefined;
  const type     = req.nextUrl.searchParams.get("type")     ?? undefined;
  const stayType = req.nextUrl.searchParams.get("stayType") ?? undefined;
  const country  = req.nextUrl.searchParams.get("country")  ?? undefined;

  const properties = await prisma.property.findMany({
    where: {
      publishStatus: "published",
      status: { in: ["AVAILABLE", "RESERVED"] },
      ...(city     ? { city:       { contains: city, mode: "insensitive" } } : {}),
      ...(type     ? { propertyType: type }     : {}),
      ...(stayType ? { stayType }               : {}),
      ...(country  ? { country }                : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      country: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      propertyType: true,
      status: true,
      imageUrl: true,
      videoUrl: true,
      images: {
        where: { status: "APPROVED" },
        orderBy: { order: "asc" },
        take: 1,
        select: { url: true, status: true, order: true },
      },
    },
  });

  return NextResponse.json(
    properties.map((p) => {
      const coverImage = getPropertyMainImage(p);
      return {
        ...p,
        price: Number(p.price),
        coverImage: coverImage.startsWith("data:") ? null : coverImage,
        images: undefined,
        videoUrl: undefined,
      };
    })
  );
}
