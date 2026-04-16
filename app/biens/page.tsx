import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FiltresBiens from "./_components/FiltresBiens";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Biens disponibles | AKIL IMMO",
  description: "Découvrez tous nos biens disponibles à la location au Bénin et en Côte d'Ivoire.",
};

export default async function BiensPage() {
  const biens = await prisma.property.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, city: true, country: true,
      price: true, bedrooms: true, bathrooms: true, imageUrl: true, videoUrl: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* En-tête */}
        <div className="mb-10">
          <span className="inline-flex rounded-full bg-[#0066CC]/10 px-4 py-1 text-sm font-semibold text-[#0066CC] mb-3">
            Disponibles maintenant
          </span>
          <h1 className="text-4xl font-semibold text-slate-900">
            Biens disponibles
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl">
            Tous nos biens disponibles à la location au Bénin et en Côte d&apos;Ivoire.
            Filtrez par pays et par ville pour trouver votre logement idéal.
          </p>
        </div>

        <FiltresBiens biens={biens} />
      </main>

      <Footer />
    </div>
  );
}
