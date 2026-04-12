"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN: "Bénin 🇧🇯",
  COTE_D_IVOIRE: "Côte d'Ivoire 🇨🇮",
};

interface Bien {
  id: string;
  title: string;
  city: string;
  country: string;
  price: unknown;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
}

const BUDGET_OPTIONS = [
  { label: "Tous les budgets", value: "TOUS" },
  { label: "< 200 000 XOF", value: "200K" },
  { label: "200K – 500K XOF", value: "200K-500K" },
  { label: "500K – 1M XOF", value: "500K-1M" },
  { label: "> 1 000 000 XOF", value: "1M+" },
];

function BienCard({ bien }: { bien: Bien }) {
  const price = new Intl.NumberFormat("fr-FR").format(Number(bien.price));
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 60px -10px rgba(0,102,204,0.25)" }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm cursor-pointer"
    >
      <Link href={`/biens/${bien.id}`} className="block">
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#E8F4FD] to-slate-100">
          {bien.imageUrl ? (
            <img
              src={bien.imageUrl}
              alt={bien.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="w-14 h-14 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          {/* Badges */}
          <span className="absolute top-3 left-3 inline-flex rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#0066CC] shadow-sm">
            {COUNTRY_LABEL[bien.country] ?? bien.country}
          </span>
          <span className="absolute top-3 right-3 inline-flex rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Disponible
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-slate-900 leading-snug mb-1 group-hover:text-[#0066CC] transition-colors line-clamp-1">
            {bien.title}
          </h3>
          <p className="text-sm text-slate-400 mb-4 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {bien.city}
          </p>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-bold text-[#0066CC]">
              {price} <span className="text-xs font-normal text-slate-400">XOF/mois</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {bien.bedrooms} ch.
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {bien.bathrooms} sdb
            </span>
            <span className="ml-auto text-[#0066CC] font-medium group-hover:underline">Voir →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-5 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-full" />
      </div>
    </div>
  );
}

export default function PropertiesSection({ biens }: { biens: Bien[] }) {
  const [filterPays, setFilterPays] = useState("TOUS");
  const [filterBudget, setFilterBudget] = useState("TOUS");

  const filtered = biens.filter((b) => {
    if (filterPays !== "TOUS" && b.country !== filterPays) return false;
    if (filterBudget !== "TOUS") {
      const price = Number(b.price);
      if (filterBudget === "200K" && price >= 200000) return false;
      if (filterBudget === "200K-500K" && (price < 200000 || price > 500000)) return false;
      if (filterBudget === "500K-1M" && (price < 500000 || price > 1000000)) return false;
      if (filterBudget === "1M+" && price < 1000000) return false;
    }
    return true;
  });

  return (
    <section className="py-20 bg-[#F8FAFC]" id="properties">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC] mb-2">Biens</p>
          <h2 className="text-3xl font-bold text-slate-900">Nos biens disponibles</h2>
          <p className="mt-2 text-slate-500 max-w-xl">
            Découvrez notre sélection de biens disponibles au Bénin et en Côte d&apos;Ivoire.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {/* Pays filter */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
            {[
              { label: "Tous", value: "TOUS" },
              { label: "🇧🇯 Bénin", value: "BENIN" },
              { label: "🇨🇮 Côte d'Ivoire", value: "COTE_D_IVOIRE" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterPays(opt.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterPays === opt.value
                    ? "bg-[#0066CC] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Budget filter */}
          <select
            value={filterBudget}
            onChange={(e) => setFilterBudget(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 cursor-pointer"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <span className="ml-auto self-center text-sm text-slate-400">
            {filtered.length} bien{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Grid */}
        {biens.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-medium">Aucun bien ne correspond à vos filtres.</p>
            <button
              onClick={() => { setFilterPays("TOUS"); setFilterBudget("TOUS"); }}
              className="mt-4 text-sm text-[#0066CC] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((bien, i) => (
              <motion.div
                key={bien.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <BienCard bien={bien} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/biens"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            Voir tous les biens disponibles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
