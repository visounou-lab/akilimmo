"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();
  const [pays, setPays] = useState("");
  const [type, setType] = useState("");
  const [prixMax, setPrixMax] = useState("");

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
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001A4E] via-[#0044AA] to-[#0066CC]" />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-white/5" />
        <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-[#7FC8FF]/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />
        <div className="absolute bottom-40 left-20 w-[200px] h-[200px] rounded-full bg-[#004499]/40 blur-xl" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* House silhouette */}
        <svg
          className="absolute bottom-0 right-0 w-[500px] h-[380px] opacity-[0.06]"
          viewBox="0 0 500 380"
          fill="white"
        >
          <polygon points="250,40 460,180 460,360 40,360 40,180" />
          <rect x="200" y="240" width="100" height="120" fill="white" />
          <rect x="80" y="200" width="80" height="60" rx="4" />
          <rect x="340" y="200" width="80" height="60" rx="4" />
          <polygon points="250,10 490,175 480,185 250,35 20,185 10,175" />
          <rect x="220" y="40" width="30" height="50" fill="white" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-1.5 text-sm font-semibold text-white mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AKIL IMMO — Bénin 🇧🇯 &amp; Côte d&apos;Ivoire 🇨🇮
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
          <select
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 cursor-pointer"
          >
            <option value="">🌍 Tous les pays</option>
            <option value="BENIN">🇧🇯 Bénin</option>
            <option value="COTE_D_IVOIRE">🇨🇮 Côte d&apos;Ivoire</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 cursor-pointer"
          >
            <option value="">🏠 Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="bureau">Bureau</option>
            <option value="terrain">Terrain</option>
          </select>
          <input
            type="number"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            placeholder="💰 Prix max (XOF)"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#0066CC] hover:bg-[#004499] active:scale-95 text-white px-6 py-3 text-sm font-semibold transition-all shadow-lg shadow-black/20"
          >
            Rechercher →
          </button>
        </motion.form>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {["Appartements", "Villas", "Bureaux", "Cotonou", "Abidjan"].map((tag) => (
            <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/10 cursor-pointer transition">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1"
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
    </section>
  );
}
