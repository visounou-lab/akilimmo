import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const PATHS = [
  "",
  "/financements",
  "/simulateur",
  "/comment-ca-fonctionne",
  "/a-propos",
  "/faq",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/reclamations",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://borealfinanx.com";
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
