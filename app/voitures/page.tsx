import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import VoituresClient from "../../components/v3/VoituresClient";

const TITLE = "Location de Voitures à Abidjan — SUV Premium | AKIL IMMO";
const DESC   = "Louez un SUV premium à Abidjan — KIA Sportage, Hyundai Tucson, KIA Seltos. 70 000 XOF/jour, 60 000 XOF/jour en long séjour. Réservation rapide sur WhatsApp.";

export async function generateMetadata(): Promise<Metadata> {
  const first = await prisma.vehicle.findFirst({
    orderBy: { createdAt: "asc" },
    select: { images: true, imageUrl: true },
  });
  const ogImage = first?.images[0] ?? first?.imageUrl ?? undefined;
  return {
    title: TITLE,
    description: DESC,
    openGraph: {
      title: TITLE,
      description: DESC,
      type: "website",
      url: "https://www.akilimmo.com/voitures",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: "Location SUV Abidjan — AKIL IMMO" }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESC,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function VoituresPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      variant: true,
      color: true,
      seats: true,
      fuel: true,
      features: true,
      priceDay: true,
      priceLong: true,
      imageUrl: true,
      images: true,
      available: true,
    },
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <VoituresClient vehicles={vehicles} />
      </main>
      <Footer showContactCTA={false} />
    </>
  );
}
