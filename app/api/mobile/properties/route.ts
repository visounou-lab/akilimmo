import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? undefined;
  const type = req.nextUrl.searchParams.get("type") ?? undefined;

  const properties = await prisma.property.findMany({
    where: {
      publishStatus: "published",
      status: { in: ["AVAILABLE", "RESERVED"] },
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(type ? { propertyType: type } : {}),
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
      images: {
        where: { isPrimary: true, status: "APPROVED" },
        take: 1,
        select: { url: true },
      },
    },
  });

  return NextResponse.json(
    properties.map((p) => ({
      ...p,
      price: Number(p.price),
      coverImage: p.images[0]?.url ?? p.imageUrl ?? null,
      images: undefined,
    }))
  );
}
