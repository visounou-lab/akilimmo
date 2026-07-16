import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import TerrainsListClient from "../../components/v3/terrains/TerrainsListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terrains à vendre — Bénin et Côte d'Ivoire | AKIL IMMO",
  description:
    "Terrains à vendre vérifiés au Bénin et en Côte d'Ivoire : parcelles viabilisées, titres fonciers et ACD. Filtrez par pays et par ville pour trouver votre terrain idéal.",
  alternates: { canonical: "/terrains" },
};

export default async function TerrainsPage() {
  const raw = await prisma.land.findMany({
    where: { status: "AVAILABLE", publishStatus: "published" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      city: true,
      country: true,
      price: true,
      surface: true,
      titleType: true,
      serviced: true,
      titleVerification: true,
      imageUrl: true,
      images: true,
    },
  });

  const terrains = raw.map((t) => ({ ...t, price: Number(t.price) }));

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <TerrainsListClient terrains={terrains} />
      </main>
      <Footer />
    </>
  );
}
