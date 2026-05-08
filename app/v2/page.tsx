import Navbar from "../../components/v2/Navbar";
import HeroSection from "../../components/v2/HeroSection";
import StatsBar from "../../components/v2/StatsBar";
import HowItWorks from "../../components/v2/HowItWorks";
import FeaturedProperties from "../../components/v2/FeaturedProperties";
import Testimonials from "../../components/v2/Testimonials";
import Footer from "../../components/v2/Footer";

export default function V2Page() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* 1. Hero émotionnel — "Réassurance Progressive" */}
        <HeroSection />

        {/* 2. Chiffres de confiance */}
        <StatsBar />

        {/* 3. Comment ça marche */}
        <HowItWorks />

        {/* 4. Biens en vedette */}
        <FeaturedProperties />

        {/* 5. Témoignages diaspora */}
        <Testimonials />
      </main>

      {/* 6. Footer avec CTA final + WhatsApp flottant */}
      <Footer />
    </>
  );
}
