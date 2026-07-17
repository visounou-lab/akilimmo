import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The application flow carries personal data and must not be indexed.
        disallow: ["/api/", "/de/antrag", "/pl/antrag", "/sv/antrag", "/cz/antrag"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
