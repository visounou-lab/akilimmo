import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import BiensListClient from "../../components/v3/BiensListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Biens disponibles — Appartements et Villas | AKIL IMMO",
  description:
    "Villas et appartements meublés vérifiés à la location au Bénin et en Côte d'Ivoire. Filtrez par pays et par ville pour trouver votre logement idéal.",
};

export default async function V3BiensPage() {
  const raw = await prisma.property.findMany({
    where: { status: "AVAILABLE", publishStatus: "published" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      country: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      imageUrl: true,
      videoUrl: true,
      propertyType: true,
      images: {
        where: { status: "APPROVED" },
        orderBy: { order: "asc" },
        select: { url: true, status: true, order: true },
      },
    },
  });

  const properties = raw.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <BiensListClient properties={properties} />
      </main>
      <Footer />
    </>
  );
}
