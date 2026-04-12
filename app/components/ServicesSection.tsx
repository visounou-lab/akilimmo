"use client";

import { motion } from "framer-motion";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Gestion locative",
    description: "Optimisation des revenus, suivi des paiements et service client dédié. Nous gérons votre bien comme si c'était le nôtre.",
    color: "from-[#0066CC] to-[#004499]",
    lightColor: "bg-[#0066CC]/10 text-[#0066CC]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Contrats sécurisés",
    description: "Génération automatique de contrats PDF conformes aux normes locales du Bénin et de Côte d'Ivoire. Signatures électroniques incluses.",
    color: "from-emerald-600 to-emerald-700",
    lightColor: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Suivi des paiements",
    description: "Tableau de bord en temps réel. Relances automatiques, historique complet et rapports financiers mensuels pour chaque propriété.",
    color: "from-orange-500 to-orange-600",
    lightColor: "bg-orange-50 text-orange-600",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC] mb-2">Services</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Une expertise complète pour chaque profil
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Propriétaire ou locataire, AKIL IMMO vous accompagne à chaque étape avec des outils modernes et une équipe locale.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              className="relative group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm overflow-hidden transition-shadow hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className={`inline-flex p-3 rounded-2xl ${s.lightColor} mb-5 transition-transform group-hover:scale-110 duration-300`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{s.description}</p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0066CC] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>En savoir plus</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
