import type { Metadata } from "next";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import VoituresClient from "../../components/v3/VoituresClient";

export const metadata: Metadata = {
  title: "Location de Voitures à Abidjan — SUV Premium | AKIL IMMO",
  description:
    "Louez un SUV premium à Abidjan — KIA Sportage, Hyundai Tucson, KIA Seltos. 70 000 XOF/jour, 60 000 XOF/jour en long séjour. Réservation rapide sur WhatsApp.",
};

export default function VoituresPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <VoituresClient />
      </main>
      <Footer />
    </>
  );
}
