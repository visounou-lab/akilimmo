import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité d'AKIL IMMO — Données collectées, utilisation, vos droits.",
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 lg:px-8 pt-36 pb-20">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#0066CC] hover:underline">← Retour à l&apos;accueil</Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Politique de confidentialité</h1>

          <Section title="Données collectées">
            <p>AKIL IMMO collecte les données suivantes :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom, prénom, email, téléphone lors de l&apos;inscription</li>
              <li>Données de navigation (cookies techniques)</li>
              <li>Informations sur les biens soumis</li>
            </ul>
          </Section>

          <Section title="Utilisation des données">
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Gérer votre compte propriétaire ou locataire</li>
              <li>Traiter vos demandes de réservation</li>
              <li>Vous envoyer des notifications liées à votre compte</li>
              <li>Améliorer nos services</li>
            </ul>
          </Section>

          <Section title="Conservation des données">
            <p>
              Vos données sont conservées pendant la durée de votre relation avec AKIL IMMO
              et supprimées sur simple demande adressée à{" "}
              <a href="mailto:info@akilimmo.com" className="text-[#0066CC]">info@akilimmo.com</a>.
            </p>
          </Section>

          <Section title="Vos droits">
            <p>
              Conformément à la réglementation applicable, vous disposez d&apos;un droit d&apos;accès,
              de rectification, de suppression et de portabilité de vos données personnelles.
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:info@akilimmo.com" className="text-[#0066CC]">info@akilimmo.com</a>.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement
              de la plateforme (session d&apos;authentification). Aucun cookie publicitaire ou de
              traçage tiers n&apos;est utilisé.
            </p>
          </Section>

          <Section title="Sécurité">
            <p>
              AKIL IMMO met en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
              Les mots de passe sont chiffrés et jamais stockés en clair.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Pour toute question relative à cette politique :{" "}
              <a href="mailto:info@akilimmo.com" className="text-[#0066CC]">info@akilimmo.com</a>
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-1">{children}</div>
    </div>
  );
}
