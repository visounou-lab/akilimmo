import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ContactForm from "../../components/contact-form";

export const metadata = {
  title: "Suivi des Paiements en Temps Réel | AKIL IMMO",
  description: "Tableau de bord en temps réel pour suivre vos paiements locatifs. Alertes, historique complet et rapports financiers.",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function SuiviPaiementsPage() {
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
              Suivi des Paiements en Temps Réel
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Visibilité totale sur vos revenus locatifs avec notre tableau de bord intuitif et performant.
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
                  icon: "📊",
                  title: "Tableau de bord temps réel",
                  desc: "Vue complète de tous vos biens et paiements en un coup d'œil",
                },
                {
                  icon: "📅",
                  title: "Historique complet",
                  desc: "Accès à tous les paiements depuis le début du contrat",
                },
                {
                  icon: "🔔",
                  title: "Alertes retards",
                  desc: "Notifications instantanées en cas de paiement manquant",
                },
                {
                  icon: "💹",
                  title: "Rapports financiers mensuels",
                  desc: "Synthèses détaillées de vos revenus et dépenses",
                },
                {
                  icon: "📄",
                  title: "Quittances automatiques",
                  desc: "Génération automatique des quittances pour vos locataires",
                },
                {
                  icon: "⬇️",
                  title: "Exports PDF",
                  desc: "Téléchargez les rapports pour votre comptabilité",
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
                "✓ Visibilité totale sur vos revenus locatifs en temps réel",
                "✓ Plus jamais oublier un retard de paiement",
                "✓ Relances automatiques de vos locataires en retard",
                "✓ Données exactes pour votre déclaration fiscale",
                "✓ Rapports détaillés disponibles à tout moment",
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

      {/* Fonctionnalités clés */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Fonctionnalités clés</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Vue d'ensemble",
                  items: [
                    "Solde total des revenus",
                    "Biens en location",
                    "Taux d'occupation",
                    "Revenus du mois"
                  ]
                },
                {
                  title: "Gestion des locataires",
                  items: [
                    "Liste complète des locataires",
                    "Contrats et documents",
                    "Historique des paiements",
                    "Coordonnées et contacts"
                  ]
                },
                {
                  title: "Rapports et analyses",
                  items: [
                    "Rapports mensuels",
                    "Graphiques de tendances",
                    "Comparatif année/année",
                    "Prévisions futures"
                  ]
                },
                {
                  title: "Sécurité et conformité",
                  items: [
                    "Accès sécurisé 24/7",
                    "Chiffrement des données",
                    "Sauvegarde automatique",
                    "Conformité RGPD"
                  ]
                }
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-600">
                        <span className="text-[#0066CC] font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Contactez-nous</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="https://wa.me/22901975982?text=Bonjour AKIL IMMO, je suis intéressé par le suivi des paiements en temps réel au Bénin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-6 py-4 text-lg font-semibold text-white transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp Bénin
              </a>

              <a
                href="https://wa.me/2250710259146?text=Bonjour AKIL IMMO, je suis intéressé par le suivi des paiements en temps réel en Côte d'Ivoire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 px-6 py-4 text-lg font-semibold text-white transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp Côte d'Ivoire
              </a>
            </div>

            <div>
              <a
                href="/#contact"
                className="block w-full text-center rounded-2xl bg-[#0066CC] hover:bg-[#004499] px-6 py-4 text-lg font-semibold text-white transition shadow-lg"
              >
                Formulaire de contact
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
