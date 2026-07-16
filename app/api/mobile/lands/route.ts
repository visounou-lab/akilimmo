import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanText } from "@/lib/mobile-normalize";

const TITLE_TYPES = ["TITRE_FONCIER", "ACD", "LETTRE_ATTRIBUTION", "CONVENTION_VENTE", "AUTRE"] as const;
type TitleType = (typeof TITLE_TYPES)[number];

export async function GET(req: NextRequest) {
  const city       = req.nextUrl.searchParams.get("city") ?? undefined;
  const rawTitle   = req.nextUrl.searchParams.get("titleType");
  const titleType  = TITLE_TYPES.includes(rawTitle as TitleType) ? (rawTitle as TitleType) : undefined;
  const rawCountry = req.nextUrl.searchParams.get("country");
  const country = rawCountry === "BENIN" || rawCountry === "COTE_D_IVOIRE"
    ? rawCountry
    : undefined;

  const lands = await prisma.land.findMany({
    where: {
      publishStatus: "published",
      status: { in: ["AVAILABLE", "RESERVED"] },
      ...(city      ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(titleType ? { titleType }                                     : {}),
      ...(country   ? { country }                                       : {}),
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
      surface: true,
      titleType: true,
      serviced: true,
      titleVerification: true,
      status: true,
      imageUrl: true,
      images: true,
    },
  });

  return NextResponse.json(
    lands.map((l) => ({
      ...l,
      title: cleanText(l.title),
      city: cleanText(l.city),
      price: Number(l.price),
      coverImage: l.images[0] ?? l.imageUrl ?? null,
      images: undefined,
    }))
  );
}
