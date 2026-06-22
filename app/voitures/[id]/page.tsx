import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../../components/v3/Navbar";
import Footer from "../../../components/v3/Footer";
import VehicleDetail from "../../../components/v3/VehicleDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return { title: "Véhicule introuvable" };
  const title = `${vehicle.name} ${vehicle.color} — Location à Abidjan | AKIL IMMO`;
  const description = `Louez le ${vehicle.name} (${vehicle.color}) à Abidjan. ${vehicle.priceDay.toLocaleString("fr-FR")} XOF/jour court séjour, ${vehicle.priceLong.toLocaleString("fr-FR")} XOF/jour long séjour. Réservation WhatsApp.`;
  const ogImage = vehicle.images[0] ?? vehicle.imageUrl ?? undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: vehicle.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <VehicleDetail vehicle={vehicle} />
      </main>
      <Footer showContactCTA={false} />
    </>
  );
}
