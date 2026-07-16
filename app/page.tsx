import { prisma } from "@/lib/prisma";
import Navbar from "../components/v3/Navbar";
import HeroSection from "../components/v3/HeroSection";
import CategoriesSection from "../components/v3/CategoriesSection";
import StatsBar from "../components/v3/StatsBar";
import HowItWorks from "../components/v3/HowItWorks";
import FeaturedProperties from "../components/v3/FeaturedProperties";
import FeaturedTerrains from "../components/v3/FeaturedTerrains";
import AkiSection from "../components/v3/AkiSection";
import PartnerSection from "../components/v3/PartnerSection";
import LaunchSection from "../components/v3/LaunchSection";
import Footer from "../components/v3/Footer";
import { derivePropertyTrust } from "@/lib/trust-badges";

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
      owner: {
        select: {
          role: true,
          verificationCases: {
            where: { type: { in: ["IDENTITY", "PROFESSIONAL"] } },
            select: { type: true, status: true, expiresAt: true },
          },
        },
      },
      verificationCases: {
        where: { type: { in: ["LISTING_REVIEW", "PHYSICAL_VISIT"] } },
        select: { type: true, status: true, expiresAt: true },
      },
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
    trust: derivePropertyTrust({
      ownerRole: p.owner.role,
      ownerVerifications: p.owner.verificationCases,
      propertyVerifications: p.verificationCases,
    }),
  }));

  const rawTerrains = await prisma.land.findMany({
    where: { status: "AVAILABLE", publishStatus: "published" },
    orderBy: { createdAt: "desc" },
    take: 6,
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
      imageUrl: true,
      images: true,
    },
  });

  const terrains = rawTerrains.map((t) => ({ ...t, price: Number(t.price) }));

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* 1. Hero charbon avec barre de recherche (Option C) */}
        <HeroSection />

        {/* 2. Nos 3 catégories de services */}
        <CategoriesSection />

        {/* 3. Chiffres de confiance */}
        <StatsBar />

        {/* 4. Biens disponibles — données réelles depuis la DB */}
        <FeaturedProperties properties={properties} />

        {/* 4bis. Terrains à vendre — affiché seulement s'il y en a */}
        {terrains.length > 0 && <FeaturedTerrains terrains={terrains} />}

        {/* 5. Comment ça marche */}
        <HowItWorks />

        {/* 5bis. Rencontrez AKI, notre mascotte */}
        <AkiSection />

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
