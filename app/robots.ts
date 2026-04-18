import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/owner/", "/api/", "/login"],
    },
    sitemap: "https://www.akilimmo.com/sitemap.xml",
  };
}
