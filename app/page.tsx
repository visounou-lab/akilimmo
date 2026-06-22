import { prisma } from "@/lib/prisma";
import Navbar from "../components/v3/Navbar";
import HeroSection from "../components/v3/HeroSection";
import CategoriesSection from "../components/v3/CategoriesSection";
import StatsBar from "../components/v3/StatsBar";
import HowItWorks from "../components/v3/HowItWorks";
import FeaturedProperties from "../components/v3/FeaturedProperties";
import PartnerSection from "../components/v3/PartnerSection";
import LaunchSection from "../components/v3/LaunchSection";
import Footer from "../components/v3/Footer";

export const revalidate = 60;

export default async function V3Page() {
  const raw = await prisma.property.findMany({
    where: { status: "AVAILABLE", publishStatus: "published" },
    orderBy: { createdAt: "desc" },
    take: 18,
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
      stayType: true,
      likesCount: true,
      viewCount: true,
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
      <main id="main-content">
        {/* 1. Hero charbon avec barre de recherche (Option C) */}
        <HeroSection />

        {/* 2. Nos 4 catégories de services */}
        <CategoriesSection />

        {/* 3. Chiffres de confiance */}
        <StatsBar />

        {/* 4. Biens disponibles — données réelles depuis la DB */}
        <FeaturedProperties properties={properties} />

        {/* 5. Comment ça marche */}
        <HowItWorks />

        {/* 6. Recrutement propriétaires & agences */}
        <PartnerSection />

        {/* 7. Phase de lancement */}
        <LaunchSection />
      </main>

      {/* 8. Footer CTA + WhatsApp flottant */}
      <Footer />
    </>
  );
}
