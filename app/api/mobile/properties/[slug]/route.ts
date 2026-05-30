import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getYouTubeThumbnailFallback } from "@/lib/youtube";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, publishStatus: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      city: true,
      address: true,
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
        orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
        take: 8,
        select: { url: true, isPrimary: true },
      },
    },
  });

  if (!property) return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });

  const allImages = property.images.map((i) => i.url);
  // Fallback: YouTube thumbnail then imageUrl
  if (allImages.length === 0) {
    const ytThumb = getYouTubeThumbnailFallback(property.videoUrl);
    if (ytThumb && !ytThumb.startsWith("data:")) allImages.push(ytThumb);
    else if (property.imageUrl) allImages.push(property.imageUrl);
  }

  return NextResponse.json({
    ...property,
    price: Number(property.price),
    images: allImages,
  });
}
