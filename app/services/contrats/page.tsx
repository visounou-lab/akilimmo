import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ContactForm from "../../components/contact-form";

export const metadata = {
  title: "Contrats Sécurisés & Conformes | AKIL IMMO",
  description: "Contrats de location conformes au droit béninois et ivoirien. Sécurité juridique pour propriétaires et locataires.",
};

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
                  desc: "Contrats professionnels et complets adaptés à votre situation",
                },
                {
                  icon: "⚖️",
                  title: "Conformité légale",
                  desc: "Respect des lois béninoises et ivoiriennes actuelles",
                },
                {
                  icon: "✍️",
                  title: "Signatures numériques",
                  desc: "Processus simple et sécurisé avec valeur légale",
                },
                {
                  icon: "🔒",
                  title: "Archivage numérique",
                  desc: "Stockage sécurisé et accessible 24/7",
                },
                {
                  icon: "📄",
                  title: "PDF téléchargeable",
                  desc: "Votre contrat à disposition en format imprimable",
                },
                {
                  icon: "🤝",
                  title: "Protection juridique",
                  desc: "Droits et obligations clairs pour propriétaires et locataires",
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
                "✓ Protection juridique complète pour propriétaire et locataire",
                "✓ Conformité garantie avec les lois locales",
                "✓ Processus rapide et sans tracasserie administrative",
                "✓ Contrats adaptés à chaque cas particulier",
                "✓ Support juridique en cas de litige",
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
            className="grid md:grid-cols-2 gap-6"
          >
            <a
              href="https://wa.me/22901975982?text=Bonjour AKIL IMMO, je suis intéressé par vos services de rédaction de contrats"
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
