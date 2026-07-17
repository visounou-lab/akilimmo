import { Sparkles } from "lucide-react";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import WaCountryPicker from "../../components/v3/WaCountryPicker";
import WaitlistForm from "../../components/v3/WaitlistForm";

export const metadata = {
  title: "Séjours — Bientôt disponible | AKIL IMMO",
  description:
    "Le service de séjours courts AKIL IMMO arrive bientôt à Cotonou et Abidjan. Laissez-nous vos coordonnées pour être informé en priorité.",
};

export default function SejoursPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section
          className="min-h-[70vh] flex items-center justify-center py-24"
          style={{ backgroundColor: "#1C1917" }}
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="mx-auto mb-8 flex items-center justify-center rounded-full"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(200,146,42,0.15)",
                border: "1px solid rgba(200,146,42,0.4)",
              }}
              aria-hidden="true"
            >
              <Sparkles size={24} style={{ color: "#C8922A" }} />
            </div>

            <p
              className="mb-4 text-xs font-medium tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#C8922A",
                letterSpacing: "0.16em",
              }}
            >
              Bientôt disponible
            </p>

            <h1
              className="mb-6"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
                color: "#FDFCF8",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Les séjours courts arrivent{" "}
              <em style={{ fontStyle: "italic", color: "#C8922A" }}>
                à Cotonou et à Abidjan.
              </em>
            </h1>

            <p
              className="mx-auto mb-10 max-w-lg text-base"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 300,
                color: "rgba(253,252,248,0.68)",
                lineHeight: 1.8,
              }}
            >
              Nous préparons une offre de séjours meublés clé en main, pensée
              pour un court passage au pays. Aucune réservation n&apos;est
              encore ouverte — laissez-nous votre email pour être averti dès
              le lancement.
            </p>

            {/* Capture email — primaire */}
            <WaitlistForm source="sejours" />

            {/* WhatsApp — secondaire */}
            <div className="mt-6">
              <WaCountryPicker
                message="Bonjour, je souhaite être informé du lancement des séjours AKIL IMMO"
                sourcePage="sejours"
                className="inline-flex items-center gap-2 cursor-pointer text-sm transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 400,
                  color: "rgba(253,252,248,0.6)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                ou prévenez-moi sur WhatsApp
              </WaCountryPicker>
            </div>
          </div>
        </section>
      </main>
      <Footer showContactCTA={false} />
    </>
  );
}
