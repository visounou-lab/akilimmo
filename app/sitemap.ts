import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE = "https://www.akilimmo.com";

// Routes publiques statiques (hors espaces authentifiés, exclus par robots.ts).
const STATIC_ROUTES: { path: string; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "",                              freq: "daily",   priority: 1.0 },
  { path: "/biens",                        freq: "daily",   priority: 0.9 },
  { path: "/terrains",                     freq: "daily",   priority: 0.9 },
  { path: "/voitures",                     freq: "daily",   priority: 0.8 },
  { path: "/sejours",                      freq: "weekly",  priority: 0.6 },
  { path: "/comment-ca-marche",            freq: "monthly", priority: 0.6 },
  { path: "/inscription",                  freq: "monthly", priority: 0.6 },
  { path: "/agence-partenaire",            freq: "monthly", priority: 0.6 },
  { path: "/services/gestion-locative",    freq: "monthly", priority: 0.5 },
  { path: "/services/contrats",            freq: "monthly", priority: 0.5 },
  { path: "/services/suivi-paiements",     freq: "monthly", priority: 0.5 },
  { path: "/mentions-legales",             freq: "yearly",  priority: 0.2 },
  { path: "/confidentialite",              freq: "yearly",  priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // Les requêtes BD sont isolées : une base momentanément injoignable ne doit
  // pas rendre tout le sitemap indisponible.
  let propertyUrls: MetadataRoute.Sitemap = [];
  let landUrls: MetadataRoute.Sitemap = [];
  let vehicleUrls: MetadataRoute.Sitemap = [];

  try {
    const properties = await prisma.property.findMany({
      where: { publishStatus: "published" },
      select: { slug: true, updatedAt: true },
    });
    propertyUrls = properties.map((p) => ({
      url: `${BASE}/biens/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {}

  try {
    const lands = await prisma.land.findMany({
      where: { publishStatus: "published" },
      select: { slug: true, updatedAt: true },
    });
    landUrls = lands.map((l) => ({
      url: `${BASE}/terrains/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {}

  try {
    const vehicles = await prisma.vehicle.findMany({
      select: { id: true, updatedAt: true },
    });
    vehicleUrls = vehicles.map((v) => ({
      url: `${BASE}/voitures/${v.id}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {}

  return [...staticUrls, ...propertyUrls, ...landUrls, ...vehicleUrls];
}
