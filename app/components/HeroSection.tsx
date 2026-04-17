"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
];

function GlobeIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SelectField({
  icon, value, onChange, children,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl bg-white pl-9 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [pays, setPays] = useState("");
  const [type, setType] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pays) params.set("pays", pays);
    if (type) params.set("type", type);
    if (prixMax) params.set("prixMax", prixMax);
    router.push(`/biens?${params.toString()}`);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow backgrounds */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SLIDES[current]}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Blue overlay */}
      <div className="absolute inset-0 bg-[#001A4E]/70 z-[1]" />

      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] z-[2] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/40 w-1.5"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-1.5 text-sm font-semibold text-white mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AKIL IMMO — Bénin &amp; Côte d&apos;Ivoire
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Vous êtes loin,
          <br />
          <span className="text-[#7FC8FF]">nous sommes là.</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-xl text-white/75 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Plateforme immobilière professionnelle. Gestion locative, contrats
          sécurisés et suivi des paiements simplifié.
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <SelectField icon={<GlobeIcon />} value={pays} onChange={setPays}>
            <option value="">Tous les pays</option>
            <option value="BENIN">Bénin</option>
            <option value="COTE_D_IVOIRE">Côte d&apos;Ivoire</option>
          </SelectField>

          <SelectField icon={<HomeIcon />} value={type} onChange={setType}>
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="bureau">Bureau</option>
            <option value="terrain">Terrain</option>
          </SelectField>

          <div className="relative flex-1 min-w-0">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <DollarIcon />
            </span>
            <input
              type="number"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              placeholder="Prix max (XOF)"
              className="w-full rounded-xl bg-white pl-9 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#0066CC] hover:bg-[#004499] active:scale-95 text-white px-6 py-3 text-sm font-semibold transition-all shadow-lg shadow-black/20 whitespace-nowrap"
          >
            Rechercher
          </button>
        </motion.form>

        <motion.div
          className="mt-8 hidden md:flex flex-wrap justify-center gap-3 text-xs text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {["Appartements", "Villas", "Bureaux", "Cotonou", "Abidjan"].map((tag) => (
            <span key={tag} className="rounded-full border border-white/20 px-3 py-1 hover:bg-white/10 cursor-pointer transition">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator — in-flow so it's never hidden behind the form */}
        <motion.div
          className="mt-4 flex flex-col items-center gap-1 text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-xs tracking-widest uppercase">Défiler</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
