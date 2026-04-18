import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FaqAccordion from "./_components/FaqAccordion";

export const metadata: Metadata = {
  title: "Comment ça marche — Propriétaires partenaires",
  description: "Découvrez comment confier votre bien à AKIL IMMO. Inscription gratuite, publication en 48h, gestion professionnelle au Bénin et en Côte d'Ivoire.",
};

const STEPS = [
  {
    emoji: "🖊️",
    title: "Inscrivez-vous",
    desc: "Créez votre compte propriétaire gratuitement. Notre équipe valide votre profil sous 24h.",
  },
  {
    emoji: "📸",
    title: "Soumettez votre bien",
    desc: "Ajoutez les photos, la description et le prix de votre bien. Nous vérifions et publions sous 48h.",
  },
  {
    emoji: "👥",
    title: "Nous gérons les locataires",
    desc: "AKIL IMMO reçoit les demandes de réservation, communique avec les locataires et assure le suivi.",
  },
  {
    emoji: "💰",
    title: "Vous recevez vos revenus",
    desc: "Vos paiements sont versés chaque mois. Suivez vos revenus en temps réel depuis votre dashboard.",
  },
];

const BENEFITS = [
  {
    emoji: "🛡️",
    title: "Sécurité",
    desc: "Vos biens sont gérés par des professionnels. Contrats sécurisés et locataires vérifiés.",
  },
  {
    emoji: "📱",
    title: "Visibilité",
    desc: "Votre bien est visible par des milliers de locataires au Bénin et en Côte d'Ivoire.",
  },
  {
    emoji: "📊",
    title: "Transparence",
    desc: "Dashboard propriétaire en temps réel. Suivez vos réservations et revenus à tout moment.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 bg-gradient-to-b from-[#0066CC] to-[#004499] text-white text-center px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-sm font-semibold mb-5">
            Pour les propriétaires
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Confiez votre bien à AKIL IMMO
          </h1>
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
            Une gestion professionnelle, transparente et sans stress. Nous nous occupons de tout.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#0066CC] px-8 py-3.5 text-sm font-bold shadow-lg hover:bg-slate-50 transition"
          >
            Devenir propriétaire partenaire
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 lg:px-8 py-20 space-y-24">

        {/* Section 1 — 4 étapes */}
        <section>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC] mb-2">Le processus</p>
            <h2 className="text-3xl font-bold text-slate-900">En 4 étapes simples</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative shrink-0 w-12 h-12 rounded-full bg-[#0066CC] flex items-center justify-center text-xl shadow-md z-10">
                    {step.emoji}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#0066CC] uppercase tracking-wider">
                        Étape {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 — Pourquoi AKIL IMMO */}
        <section>
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC] mb-2">Nos avantages</p>
            <h2 className="text-3xl font-bold text-slate-900">Pourquoi choisir AKIL IMMO ?</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 text-center">
                <div className="text-4xl mb-4">{b.emoji}</div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — FAQ */}
        <section>
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC] mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">Questions fréquentes</h2>
          </div>
          <FaqAccordion />
        </section>

        {/* CTA final */}
        <section className="rounded-3xl bg-[#0066CC] p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Prêt à nous rejoindre ?</h2>
          <p className="text-white/80 mb-8">
            Rejoignez les propriétaires qui font confiance à AKIL IMMO.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0066CC] px-8 py-3.5 text-sm font-bold shadow-md hover:bg-slate-50 transition"
            >
              Créer mon compte propriétaire
            </Link>
            <a
              href="#contact"
              className="text-sm font-medium text-white/80 hover:text-white transition underline underline-offset-4"
            >
              Nous contacter d&apos;abord
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
