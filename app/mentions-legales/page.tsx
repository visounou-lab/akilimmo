import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales d'AKIL IMMO — Éditeur, hébergement, propriété intellectuelle.",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 lg:px-8 pt-36 pb-20">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#0066CC] hover:underline">← Retour à l&apos;accueil</Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Mentions légales</h1>

          <Section title="Éditeur du site">
            <p><strong>AKIL IMMO — Akil Services</strong></p>
            <p>Site web : <a href="https://www.akilimmo.com" className="text-[#0066CC]">www.akilimmo.com</a></p>
            <p>Email : <a href="mailto:info@akilimmo.com" className="text-[#0066CC]">info@akilimmo.com</a></p>
            <p>Téléphone Bénin : +229 01 97 59 86 82</p>
            <p>Téléphone Côte d&apos;Ivoire : +225 07 10 25 91 46</p>
          </Section>

          <Section title="Directeur de la publication">
            <p>David Ayina Akilotan</p>
          </Section>

          <Section title="Hébergement">
            <p><strong>Vercel Inc.</strong></p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
            <p><a href="https://vercel.com" className="text-[#0066CC]">vercel.com</a></p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, vidéos) est la propriété exclusive
              d&apos;AKIL IMMO. Toute reproduction, représentation ou diffusion, en tout ou partie, est interdite
              sans autorisation préalable écrite d&apos;AKIL IMMO.
            </p>
          </Section>

          <Section title="Limitation de responsabilité">
            <p>
              AKIL IMMO s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations publiées
              sur ce site. Nous ne saurions être tenus responsables des erreurs, omissions ou résultats
              qui pourraient être obtenus par un mauvais usage de ces informations.
            </p>
          </Section>

          <Section title="Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit béninois. Tout litige relatif
              à leur interprétation relève de la compétence exclusive des juridictions compétentes.
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
