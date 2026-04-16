import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ContactForm from "../../components/contact-form";

export const metadata = {
  title: "Gestion Locative Professionnelle | AKIL IMMO",
  description: "Gérez vos biens en location facilement. Encaissement des loyers, suivi des paiements, rapports mensuels.",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function GestionLocativePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#0066CC]/5 to-slate-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Gestion Locative Professionnelle
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Gérez tous vos biens en location avec facilité. Laissez AKIL IMMO s&apos;occuper de l&apos;administration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ce qu'on fait */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Ce que nous faisons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "💰",
                  title: "Encaissement des loyers",
                  desc: "Récupération automatique des paiements de vos locataires",
                },
                {
                  icon: "📊",
                  title: "Suivi des paiements",
                  desc: "Historique complet et transparent de tous les versements",
                },
                {
                  icon: "⏰",
                  title: "Relances automatiques",
                  desc: "Notifications et rappels en cas de retard de paiement",
                },
                {
                  icon: "📋",
                  title: "Rapports mensuels",
                  desc: "Synthèse détaillée de vos revenus locatifs",
                },
                {
                  icon: "🔐",
                  title: "Interface propriétaire",
                  desc: "Accès 24/7 à votre tableau de bord personnalisé",
                },
                {
                  icon: "🌍",
                  title: "Gérez de partout",
                  desc: "Paris, Abidjan, ou n&apos;importe où dans le monde",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-[#0066CC] hover:bg-[#0066CC]/5 transition"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Avantages</h2>
            <div className="space-y-4">
              {[
                "✓ Gérez votre patrimoine depuis Paris, Abidjan, ou n'importe où",
                "✓ Plus de stress avec les paiements en retard",
                "✓ Rapports financiers automatisés et disponibles 24/7",
                "✓ Conformité légale aux droits béninois et ivoirien",
                "✓ Support dédié en français",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-lg text-slate-700 p-4 rounded-lg bg-white border border-slate-100"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tarifs</h2>
            <p className="text-xl text-slate-600 mb-6">
              Sur devis selon le nombre de biens et la complexité de votre portefeuille
            </p>
            <div className="inline-block bg-[#0066CC]/10 rounded-2xl p-8 border border-[#0066CC]/20">
              <p className="text-lg font-semibold text-slate-900">
                Contactez-nous pour une proposition personnalisée
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <a
              href="https://wa.me/22901975982?text=Bonjour AKIL IMMO, je suis intéressé par la gestion locative professionnelle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-6 py-4 text-lg font-semibold text-white transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              Contactez via WhatsApp
            </a>

            <a
              href="/#contact"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#0066CC] hover:bg-[#004499] px-6 py-4 text-lg font-semibold text-white transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Formulaire de contact
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
