"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ContactForm from "../../components/contact-form";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ContratsPage() {
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
              Contrats Sécurisés & Conformes
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des contrats de location rédigés par des experts, conformes aux lois béninoises et ivoiriennes.
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
                  icon: "📝",
                  title: "Rédaction de contrats",
                  desc: "Contrats de bail conformes au droit béninois et ivoirien",
                },
                {
                  icon: "⚖️",
                  title: "Conformité légale",
                  desc: "Respect total des lois locales et nationales",
                },
                {
                  icon: "✍️",
                  title: "Signatures des deux parties",
                  desc: "Signature du propriétaire et du locataire",
                },
                {
                  icon: "🔒",
                  title: "Archivage numérique",
                  desc: "Stockage sécurisé et accessible 24/7",
                },
                {
                  icon: "📄",
                  title: "PDF téléchargeable",
                  desc: "Votre contrat disponible à tout moment",
                },
                {
                  icon: "⚡",
                  title: "Pas de notaire",
                  desc: "Contrat valide devant les tribunaux sans besoin de notaire",
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
                "✓ Protection juridique totale pour propriétaire et locataire",
                "✓ Contrat valable devant les tribunaux",
                "✓ Zéro besoin de notaire — économies d'argent",
                "✓ Processus rapide et transparent",
                "✓ Conformité garantie aux codes civils béninois et ivoirien",
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

      {/* Processus */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Notre processus</h2>
            <div className="space-y-6">
              {[
                { step: "1", title: "Consultation", desc: "Nous comprenons votre situation et vos besoins" },
                { step: "2", title: "Rédaction", desc: "Un contrat personnalisé et conforme" },
                { step: "3", title: "Révision", desc: "Vérification juridique complète" },
                { step: "4", title: "Signature", desc: "Signature numérique sécurisée" },
                { step: "5", title: "Archivage", desc: "Stockage sécurisé et accès permanent" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
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
                href="https://wa.me/22997598682?text=Bonjour AKIL IMMO, je suis intéressé par vos services de rédaction de contrats au Bénin"
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
                href="https://wa.me/2250710259146?text=Bonjour AKIL IMMO, je suis intéressé par vos services de rédaction de contrats en Côte d'Ivoire"
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
