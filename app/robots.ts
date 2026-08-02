import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/owner/",
        "/agent/",
        "/tenant/",
        "/api/",
        "/login",
        "/register",
        "/verify",
        "/verification",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: "https://www.akilimmo.com/sitemap.xml",
  };
}
