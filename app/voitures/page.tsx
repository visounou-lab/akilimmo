import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import VoituresClient from "../../components/v3/VoituresClient";

export const metadata: Metadata = {
  title: "Location de Voitures à Abidjan — SUV Premium | AKIL IMMO",
  description:
    "Louez un SUV premium à Abidjan — KIA Sportage, Hyundai Tucson, KIA Seltos. 70 000 XOF/jour, 60 000 XOF/jour en long séjour. Réservation rapide sur WhatsApp.",
};

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
      <Footer />
    </>
  );
}
