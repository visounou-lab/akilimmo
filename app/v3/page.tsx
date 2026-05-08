import Navbar from "../../components/v3/Navbar";
import HeroSection from "../../components/v3/HeroSection";
import StatsBar from "../../components/v3/StatsBar";
import HowItWorks from "../../components/v3/HowItWorks";
import FeaturedProperties from "../../components/v3/FeaturedProperties";
import Testimonials from "../../components/v3/Testimonials";
import Footer from "../../components/v3/Footer";

export default function V3Page() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* 1. Hero émotionnel */}
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

      {/* 6. Footer CTA + WhatsApp flottant */}
      <Footer />
    </>
  );
}
