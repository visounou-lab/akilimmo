import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanText } from "@/lib/mobile-normalize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const land = await prisma.land.findUnique({
    where: { slug, publishStatus: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      city: true,
      address: true,
      country: true,
      price: true,
      surface: true,
      titleType: true,
      serviced: true,
      titleVerification: true,
      titleVerificationNote: true,
      titleVerifiedAt: true,
      status: true,
      imageUrl: true,
      images: true,
      videoUrl: true,
    },
  });

  if (!land) return NextResponse.json({ error: "Terrain introuvable" }, { status: 404 });

  const allImages = [...land.images];
  if (allImages.length === 0 && land.imageUrl) allImages.push(land.imageUrl);

  return NextResponse.json({
    ...land,
    title: cleanText(land.title),
    city: cleanText(land.city),
    address: cleanText(land.address),
    price: Number(land.price),
    images: allImages,
    videoUrl: land.videoUrl ?? null,
  });
}
