import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE = "https://www.akilimmo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await prisma.property.findMany({
    where:  { publishStatus: "published" },
    select: { slug: true, updatedAt: true },
  });

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url:              `${BASE}/biens/${p.slug}`,
    lastModified:     p.updatedAt,
    changeFrequency:  "weekly",
    priority:         0.8,
  }));

  return [
    { url: BASE,                   lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/biens`,        lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/contact`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/inscription`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...propertyUrls,
  ];
}
