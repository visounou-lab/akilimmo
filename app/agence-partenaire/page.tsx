import type { Metadata } from "next";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import AgentApplicationForm from "./_form";
import {
  BadgeDollarSign,
  Building2,
  ChartNoAxesCombined,
  Headphones,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Devenir Agent Immo Partenaire — AKIL IMMO",
  description:
    "Créez votre compte agent AKIL IMMO et transmettez vos justificatifs professionnels dans un espace sécurisé.",
};

export default function AgencePartenairePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16" style={{ backgroundColor: "#FDFCF8" }}>

        {/* ── Hero ── */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#1C1917" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <span
              className="inline-block mb-5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,146,42,0.15)", color: "#C8922A", border: "1px solid rgba(200,146,42,0.3)" }}
            >
              Inscriptions sécurisées ouvertes
            </span>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#FDFCF8",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
              }}
            >
              Devenez Agent Immo<br />
              <span style={{ color: "#C8922A" }}>Partenaire AKIL IMMO</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 300,
                fontSize: "1.0625rem",
                color: "#A8998A",
                lineHeight: 1.75,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Développez votre activité en vous appuyant sur notre plateforme. Apportez des clients,
              concluez des locations et percevez une commission à chaque transaction réussie.
            </p>
          </div>
        </section>

        {/* ── Avantages ── */}
        <section className="py-16 lg:py-20" style={{ backgroundColor: "#FDFCF8" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p
              className="text-center mb-10 text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A" }}
            >
              CE QUE VOUS GAGNEZ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: BadgeDollarSign,
                  title: "Commission attractive",
                  desc: "Percevez une commission sur chaque location conclue grâce à votre réseau. Tarifs préférentiels pour les agents certifiés.",
                },
                {
                  icon: Building2,
                  title: "Accès à notre catalogue",
                  desc: "Accédez à tous nos biens disponibles en Côte d'Ivoire et au Bénin. Proposez-les directement à vos clients.",
                },
                {
                  icon: ChartNoAxesCombined,
                  title: "Tableau de bord dédié",
                  desc: "Suivez vos apports, vos commissions et vos transactions en temps réel depuis votre espace agent.",
                },
                {
                  icon: ShieldCheck,
                  title: "Sécurité et conformité",
                  desc: "Travaillez dans un cadre légal conforme aux exigences du gouvernement ivoirien pour les démarcheurs immobiliers.",
                },
                {
                  icon: Landmark,
                  title: "Paiements rapides",
                  desc: "Commissions versées rapidement après la confirmation de la location. Traçabilité complète de chaque transaction.",
                },
                {
                  icon: Headphones,
                  title: "Support dédié",
                  desc: "Un interlocuteur AKIL IMMO disponible pour vous accompagner dans vos démarches et répondre à vos questions.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: "#FDFCF8",
                    border: "1.5px solid rgba(200,146,42,0.2)",
                    borderRadius: 16,
                    padding: "1.5rem",
                    boxShadow: "0 2px 12px rgba(28,25,23,0.05)",
                  }}
                >
                  <item.icon className="mb-3 text-[#C8922A]" size={26} aria-hidden="true" />
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#1C1917",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      color: "#6B5E52",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conditions légales ── */}
        <section className="py-16" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p
              className="text-center mb-8 text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A" }}
            >
              CONDITIONS REQUISES
            </p>
            <div
              style={{
                backgroundColor: "#FDFCF8",
                border: "1.5px solid rgba(200,146,42,0.25)",
                borderRadius: 20,
                padding: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  color: "#1C1917",
                  marginBottom: "1.25rem",
                }}
              >
                AKIL IMMO opère en <strong>Côte d&apos;Ivoire</strong> et au <strong>Bénin</strong>.
                Conformément aux réglementations en vigueur dans chaque pays sur l&apos;exercice des activités
                immobilières, tout agent partenaire doit justifier d&apos;une activité légalement déclarée.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* CI */}
                <div style={{ border: "1px solid rgba(200,146,42,0.2)", borderRadius: 12, padding: "1rem" }}>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#C8922A", marginBottom: "0.5rem" }}>
                    Côte d&apos;Ivoire
                  </p>
                  <ul style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "#6B5E52", lineHeight: 2, paddingLeft: "1.1rem", margin: 0 }}>
                    <li>Carte professionnelle ou autorisation d&apos;exercice, <strong>OU</strong></li>
                    <li>RCCM valide mentionnant l&apos;activité immobilière</li>
                    <li>Assurance professionnelle recommandée</li>
                  </ul>
                </div>
                {/* Bénin */}
                <div style={{ border: "1px solid rgba(200,146,42,0.2)", borderRadius: 12, padding: "1rem" }}>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#C8922A", marginBottom: "0.5rem" }}>
                    Bénin
                  </p>
                  <ul style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "#6B5E52", lineHeight: 2, paddingLeft: "1.1rem", margin: 0 }}>
                    <li>Carte professionnelle ou autorisation d&apos;exercice, <strong>OU</strong></li>
                    <li>RCCM valide mentionnant l&apos;activité immobilière</li>
                    <li>Assurance professionnelle recommandée</li>
                  </ul>
                </div>
              </div>

              <ul
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "#6B5E52",
                  lineHeight: 2,
                  paddingLeft: "1.25rem",
                  margin: 0,
                }}
              >
                <li>Téléphone professionnel joignable</li>
                <li>Zone d&apos;activité déclarée (ville / quartiers couverts)</li>
              </ul>
              <div
                className="mt-4 rounded-xl px-4 py-3"
                style={{ backgroundColor: "rgba(200,146,42,0.08)", border: "1px solid rgba(200,146,42,0.2)" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8125rem",
                    color: "#C8922A",
                    margin: 0,
                  }}
                >
                  Les documents seront transmis uniquement dans votre espace privé après confirmation de l&apos;email.
                  Aucun partenariat ne sera activé sans vérification préalable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Formulaire ── */}
        <section className="py-16 lg:py-24" style={{ backgroundColor: "#FDFCF8" }}>
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p
                className="mb-3 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A" }}
              >
                OUVERTURE DU DOSSIER
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  color: "#1C1917",
                }}
              >
                Créez votre compte agent
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  color: "#6B5E52",
                  marginTop: "0.5rem",
                }}
              >
                L’inscription ouvre un dossier, mais n’active ni le rôle agent ni les commissions.
                L’activation intervient seulement après contrôle complet.
              </p>
            </div>
            <AgentApplicationForm />
          </div>
        </section>

      </main>
      <Footer showContactCTA={false} />
    </>
  );
}
