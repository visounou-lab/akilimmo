import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";

export const metadata: Metadata = {
  title: "Mentions légales | AKIL IMMO",
  description: "Identification de l’éditeur, règles d’utilisation et responsabilités d’AKIL IMMO.",
};

const updatedAt = "3 juillet 2026";

export default function MentionsLegalesPage() {
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
                Informations juridiques
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Mentions légales</h1>
              <p className="mt-3 text-sm text-white/70">Dernière mise à jour : {updatedAt}</p>
            </header>

            <div className="space-y-10 px-6 py-10 text-base leading-7 text-[#475569] sm:px-10">
              <Section title="Éditeur du service">
                <p>
                  <strong className="text-[#1C1917]">AKIL IMMO</strong>, nom commercial exploité par{" "}
                  <strong className="text-[#1C1917]">Akil Services</strong>.
                </p>
                <p>Implantation : Abomey-Calavi, Tokan, Bénin · Abidjan, Côte d’Ivoire.</p>
                <p>
                  Site :{" "}
                  <a className="legal-link" href="https://www.akilimmo.com">
                    www.akilimmo.com
                  </a>
                </p>
                <p>
                  Email :{" "}
                  <a className="legal-link" href="mailto:info@akilimmo.com">
                    info@akilimmo.com
                  </a>
                </p>
                <p>Téléphone Bénin : +229 01 97 59 86 82</p>
                <p>Téléphone Côte d’Ivoire : +225 07 10 25 91 46</p>
              </Section>

              <Section title="Directeur de la publication">
                <p>
                  <strong className="text-[#1C1917]">Prince Ayina Akilotan</strong>
                </p>
              </Section>

              <Section title="Nature du service">
                <p>
                  AKIL IMMO met en relation des personnes recherchant un logement, des propriétaires
                  et des professionnels de l’immobilier. La plateforme peut également proposer des
                  services d’accompagnement, de réservation et de gestion documentaire.
                </p>
                <p>
                  Les badges décrivent uniquement le contrôle indiqué : identité, justificatifs
                  professionnels, contenu d’une annonce ou visite terrain. Ils ne constituent ni une
                  garantie de solvabilité, ni une certification du titre foncier, ni une promesse
                  d’absence de litige. Chaque utilisateur doit vérifier le contrat et les conditions
                  de la transaction avant tout paiement.
                </p>
              </Section>

              <Section title="Contenus publiés par les utilisateurs">
                <p>
                  L’auteur d’une annonce garantit disposer des droits, autorisations et mandats
                  nécessaires pour publier son contenu et proposer le bien. AKIL IMMO peut demander
                  des justificatifs, suspendre une annonce, conserver les éléments utiles à une
                  enquête ou signaler une fraude présumée aux autorités compétentes.
                </p>
                <p>
                  Tout contenu suspect peut être signalé à{" "}
                  <a className="legal-link" href="mailto:info@akilimmo.com">
                    info@akilimmo.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="Propriété intellectuelle">
                <p>
                  La marque, l’interface, les textes et les éléments créés par AKIL IMMO sont protégés.
                  Les contenus fournis par les utilisateurs restent sous leur responsabilité ; ils
                  accordent à AKIL IMMO les droits nécessaires à leur affichage, leur contrôle et leur
                  diffusion dans le cadre du service.
                </p>
              </Section>

              <Section title="Disponibilité et responsabilité">
                <p>
                  AKIL IMMO met en œuvre des moyens raisonnables pour maintenir le service et
                  contrôler les informations publiées. Une interruption technique ou une information
                  fournie par un tiers peut néanmoins survenir. Aucune clause de cette page ne limite
                  les droits impératifs des consommateurs ni une responsabilité qui ne peut être
                  exclue par la loi.
                </p>
              </Section>

              <Section title="Données personnelles">
                <p>
                  Le traitement des données personnelles est décrit dans notre{" "}
                  <Link className="legal-link" href="/confidentialite">
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </Section>

              <Section title="Hébergement technique">
                <details className="rounded-xl border border-[#E2D6C8] bg-[#F5F0E8] px-4 py-3">
                  <summary className="cursor-pointer font-semibold text-[#1B4D3E]">
                    Afficher l’identification minimale du prestataire
                  </summary>
                  <p className="mt-3">
                    Vercel Inc. · États-Unis ·{" "}
                    <a
                      className="legal-link"
                      href="https://vercel.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      vercel.com
                    </a>
                  </p>
                </details>
              </Section>

              <Section title="Droit applicable et règlement des différends">
                <p>
                  Le service est exploité depuis le Bénin et intervient également en Côte d’Ivoire.
                  Le droit applicable dépend de la nature de la relation, du lieu du bien et des règles
                  impératives protégeant l’utilisateur. Les parties rechercheront d’abord une solution
                  amiable. À défaut, les juridictions légalement compétentes pourront être saisies.
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
