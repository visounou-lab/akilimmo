import type { MetadataRoute } from "next";
import { routeLocales, localeConfig } from "@/lib/i18n/config";
import { slugs } from "@/lib/nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Public, indexable pages (the application flow is intentionally excluded).
const PUBLIC_SLUGS = [
  undefined,
  slugs.leistungen,
  slugs.kreditrechner,
  slugs.ablauf,
  slugs.unterlagen,
  slugs.ueberUns,
  slugs.faq,
  slugs.kontakt,
  slugs.impressum,
  slugs.datenschutz,
  slugs.cookies,
  slugs.nutzungsbedingungen,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const slug of PUBLIC_SLUGS) {
    for (const locale of routeLocales) {
      const path = slug ? `/${locale}/${slug}` : `/${locale}`;
      // hreflang alternates for each URL.
      const languages: Record<string, string> = {};
      for (const rl of routeLocales) {
        languages[localeConfig[rl].bcp47] = slug ? `${SITE_URL}/${rl}/${slug}` : `${SITE_URL}/${rl}`;
      }
      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: slug ? 0.7 : 1,
        alternates: { languages },
      });
    }
  }
  return entries;
}
