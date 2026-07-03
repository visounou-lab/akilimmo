import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité | AKIL IMMO",
  description: "Données collectées, finalités, sécurité et droits des utilisateurs d’AKIL IMMO.",
};

const updatedAt = "3 juillet 2026";

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8] pb-20 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[#1B4D3E] underline decoration-[#C8922A]/50 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
          >
            ← Retour à l’accueil
          </Link>

          <article className="mt-5 overflow-hidden rounded-3xl border border-[#E2D6C8] bg-[#FDFCF8] shadow-sm">
            <header className="border-b border-[#E2D6C8] bg-[#1C1917] px-6 py-10 text-white sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8922A]">
                Protection des données
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Politique de confidentialité
              </h1>
              <p className="mt-3 text-sm text-white/70">Dernière mise à jour : {updatedAt}</p>
            </header>

            <div className="space-y-10 px-6 py-10 text-base leading-7 text-[#475569] sm:px-10">
              <Section title="Responsable du traitement">
                <p>
                  AKIL IMMO — Akil Services détermine les finalités et les moyens des traitements
                  décrits ci-dessous. Contact :{" "}
                  <a className="legal-link" href="mailto:info@akilimmo.com">
                    info@akilimmo.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="Données collectées">
                <ul className="list-disc space-y-2 pl-5">
                  <li>identité, coordonnées, pays, ville et informations du compte ;</li>
                  <li>
                    pièces d’identité, cartes professionnelles, RCCM, assurances, preuves de
                    propriété et mandats transmis pour vérification ;
                  </li>
                  <li>annonces, photos, vidéos, documents et informations relatives aux biens ;</li>
                  <li>demandes de réservation, contrats, paiements et échanges avec le support ;</li>
                  <li>
                    codes de parrainage, relations de parrainage et éléments nécessaires au contrôle
                    d’une éventuelle commission ;
                  </li>
                  <li>
                    adresse IP, journaux de sécurité, appareil, navigateur et événements de navigation
                    soumis au consentement lorsqu’il est requis.
                  </li>
                </ul>
                <p>
                  Nous ne demandons pas de données biométriques. N’envoyez jamais vos justificatifs
                  par WhatsApp : utilisez uniquement l’espace privé prévu à cet effet.
                </p>
              </Section>

              <Section title="Finalités et fondements">
                <ul className="list-disc space-y-2 pl-5">
                  <li>créer et sécuriser le compte, fournir le service et gérer les réservations ;</li>
                  <li>
                    vérifier l’identité, le rôle professionnel, l’autorité sur un bien et prévenir la
                    fraude ;
                  </li>
                  <li>gérer les contrats, obligations légales, réclamations et preuves d’audit ;</li>
                  <li>assurer la sécurité, détecter les abus et défendre les droits d’AKIL IMMO ;</li>
                  <li>mesurer l’audience avec Google Analytics uniquement après consentement.</li>
                </ul>
                <p>
                  Selon le traitement, le fondement est l’exécution du contrat ou de mesures
                  précontractuelles, une obligation légale, l’intérêt légitime de sécuriser la
                  plateforme ou votre consentement.
                </p>
              </Section>

              <Section title="Destinataires et sous-traitants">
                <p>
                  L’accès est limité aux personnes habilitées d’AKIL IMMO et aux prestataires
                  nécessaires à l’hébergement, la base de données, le stockage privé des documents,
                  l’envoi d’emails, la sécurité et la mesure d’audience. Les documents de vérification
                  ne sont pas publics et leur consultation administrative génère une trace d’audit.
                </p>
                <p>
                  Certaines fonctions ouvrent des services tiers, notamment WhatsApp, YouTube et
                  Google Maps. Leurs propres politiques s’appliquent lorsque vous les utilisez.
                  AKIL IMMO ne vend pas vos données personnelles.
                </p>
              </Section>

              <Section title="Transferts internationaux">
                <p>
                  Les prestataires techniques peuvent traiter ou héberger des données en dehors du
                  Bénin et de la Côte d’Ivoire, notamment dans l’Union européenne et aux États-Unis.
                  AKIL IMMO doit encadrer ces transferts par les mécanismes contractuels et formalités
                  exigés par la réglementation applicable.
                </p>
              </Section>

              <Section title="Durées de conservation">
                <p>
                  Les données sont conservées pendant la durée nécessaire au service, à la
                  vérification, à la prévention de la fraude et au respect des obligations légales.
                  Les comptes et dossiers actifs sont réexaminés périodiquement. Les dossiers refusés
                  ou abandonnés sont supprimés ou anonymisés lorsqu’ils ne sont plus nécessaires à une
                  contestation ou à la sécurité. Les contrats, paiements et preuves d’audit peuvent
                  être archivés pendant les délais légaux applicables.
                </p>
                <p>
                  Les données Analytics suivent la durée configurée dans l’outil après consentement.
                  Une demande d’effacement est traitée sous réserve des obligations de conservation
                  et de la défense de droits en justice.
                </p>
              </Section>

              <Section title="Sécurité">
                <p>
                  Les mots de passe sont hachés et ne sont pas stockés en clair. Les justificatifs
                  sont stockés dans un espace privé, consultables via des liens signés de courte durée.
                  Les accès administratifs et décisions de vérification sont journalisés. Aucun
                  système ne pouvant être garanti sans risque, tout incident suspect doit être signalé
                  immédiatement à{" "}
                  <a className="legal-link" href="mailto:info@akilimmo.com">
                    info@akilimmo.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="Cookies et mesure d’audience">
                <p>
                  Les cookies de session et de sécurité sont nécessaires au fonctionnement du compte.
                  Google Analytics n’est chargé qu’après votre accord dans le bandeau de consentement.
                  Vous pouvez refuser les cookies de mesure sans perdre l’accès aux fonctions
                  essentielles et modifier votre choix en supprimant les préférences du site dans
                  votre navigateur.
                </p>
              </Section>

              <Section title="Vos droits">
                <p>
                  Selon la réglementation applicable, vous pouvez demander l’accès, la rectification,
                  l’effacement, la limitation, l’opposition et la portabilité de vos données, ainsi que
                  retirer un consentement. Une preuve raisonnable d’identité peut être demandée pour
                  éviter qu’un tiers n’accède à votre compte.
                </p>
                <p>
                  Adressez votre demande à{" "}
                  <a className="legal-link" href="mailto:info@akilimmo.com">
                    info@akilimmo.com
                  </a>
                  . Vous pouvez également saisir l’
                  <a
                    className="legal-link"
                    href="https://apdp.bj"
                    target="_blank"
                    rel="noreferrer"
                  >
                    APDP au Bénin
                  </a>{" "}
                  ou l’
                  <a
                    className="legal-link"
                    href="https://www.artci.ci"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ARTCI en Côte d’Ivoire
                  </a>
                  .
                </p>
              </Section>

              <Section title="Décisions automatisées et mineurs">
                <p>
                  Aucun rôle vérifié ni badge professionnel n’est accordé par une décision entièrement
                  automatisée. Le service contractuel n’est pas destiné aux mineurs non émancipés.
                </p>
              </Section>

              <Section title="Évolution de la politique">
                <p>
                  Cette politique peut évoluer avec les fonctions du service ou la réglementation.
                  La date de mise à jour est affichée en haut de page. Une modification importante
                  pourra être signalée dans l’application ou par email.
                </p>
              </Section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="border-b border-[#E2D6C8] pb-3 font-serif text-xl font-bold text-[#1C1917]">
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
