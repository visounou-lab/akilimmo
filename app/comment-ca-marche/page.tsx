import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import PageHero from "../../components/v3/comment-ca-marche/PageHero";
import ProcessSteps from "../../components/v3/comment-ca-marche/ProcessSteps";
import WhyAkil from "../../components/v3/comment-ca-marche/WhyAkil";
import FaqAccordion from "../../components/v3/comment-ca-marche/FaqAccordion";
import CtaFinal from "../../components/v3/comment-ca-marche/CtaFinal";

export const metadata = {
  title: "Comment ça marche — AKIL IMMO",
  description:
    "Propriétaires en Côte d'Ivoire et au Bénin : découvrez comment confier votre bien meublé à AKIL IMMO et louer à distance sans stress.",
};

export default function CommentCaMarchePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <PageHero />
        <ProcessSteps />
        <WhyAkil />
        <FaqAccordion />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
