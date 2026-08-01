import type { MetadataRoute } from "next";

// PWA / installable app manifest — identité AKIL IMMO (ink + or).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKIL IMMO — Location Appartements & Villas",
    short_name: "AKIL IMMO",
    description:
      "Location d'appartements et villas meublées à Cotonou, Abomey-Calavi et Abidjan.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#1C1917",
    theme_color: "#1C1917",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
