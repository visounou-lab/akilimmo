import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import BiensListClient from "../../components/v3/BiensListClient";
import { derivePropertyTrust } from "@/lib/trust-badges";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: "Biens disponibles — Appartements et Villas | AKIL IMMO",
    description:
      "Villas et appartements meublés vérifiés à la location au Bénin et en Côte d'Ivoire. Filtrez par pays et par ville pour trouver votre logement idéal.",
    // La page canonique reste toujours /biens sans filtre : Google ne doit jamais
    // indexer une variante filtrée (?q=...) comme une page distincte, sinon ces
    // URL vides ou trop spécifiques finissent par remplacer /biens dans les
    // résultats de recherche.
    alternates: { canonical: "/biens" },
    robots: q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function V3BiensPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

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

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <BiensListClient properties={properties} initialSearch={q ?? ""} />
      </main>
      <Footer />
    </>
  );
}
