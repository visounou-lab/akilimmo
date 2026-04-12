"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Adjoua Koffi",
    city: "Abidjan, Côte d'Ivoire",
    text: "Grâce à AKIL IMMO, j'ai trouvé mon appartement en moins d'une semaine depuis Paris. Le suivi était impeccable et les contrats parfaitement gérés à distance.",
    initials: "AK",
    color: "bg-[#0066CC]",
    stars: 5,
  },
  {
    name: "Romuald Hounsou",
    city: "Cotonou, Bénin",
    text: "Propriétaire de 3 biens au Bénin, AKIL IMMO gère tout pour moi. Les loyers sont toujours encaissés à temps et je reçois mes rapports chaque mois. Service exceptionnel.",
    initials: "RH",
    color: "bg-emerald-600",
    stars: 5,
  },
  {
    name: "Marie-Claire Diallo",
    city: "Abomey-Calavi, Bénin",
    text: "J'ai loué via AKIL IMMO et l'expérience était très professionnelle. Les documents étaient prêts en quelques heures et l'équipe disponible pour chaque question.",
    initials: "MD",
    color: "bg-orange-500",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#001A4E] to-[#0066CC]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#7FC8FF] mb-2">Témoignages</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Des centaines de propriétaires et locataires satisfaits au Bénin et en Côte d&apos;Ivoire.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-white/85 leading-relaxed text-sm mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                  <span className="text-sm font-bold text-white">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/60">{t.city}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
