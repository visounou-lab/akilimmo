"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Accueil",              href: "/" },
  { label: "Biens",                href: "/biens" },
  { label: "Devenir propriétaire", href: "/inscription" },
  { label: "Comment ça marche",    href: "/comment-ca-marche" },
];

const serviceItems = [
  { label: "Gestion locative",     href: "/services/gestion-locative" },
  { label: "Contrats sécurisés",   href: "/services/contrats" },
  { label: "Suivi des paiements",  href: "/services/suivi-paiements" },
];

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session }               = useSession();
  const pathname                        = usePathname();
  const isBienDetail                    = /^\/biens\/.+/.test(pathname);

  function scrollToReservation() {
    const el = document.getElementById("reserver-bien");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const user     = session?.user as { role?: string; status?: string } | undefined;
  const isOwner  = user?.role === "OWNER" && user?.status === "active";
  const isAdmin  = user?.role === "ADMIN";
  const isLogged = !!session;

  useEffect(() => {
    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        rafId = null;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const dashboardHref = isAdmin ? "/dashboard" : isOwner ? "/owner/dashboard" : "/login";

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0066CC] shadow-lg shadow-[#0066CC]/20 border-b border-[#0054a3]/30"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center shrink-0">
          <div className="bg-[#0066CC] rounded-xl px-2 py-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Akil Immo" style={{ height: "38px", width: "auto" }} />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}
              className="text-sm font-medium text-white/85 transition hover:text-white">
              {item.label}
            </a>
          ))}

          {/* Services dropdown */}
          <div className="relative"
            onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); setServicesOpen(true); }}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setServicesOpen(false), 200); }}>
            <button className="text-sm font-medium text-white/85 transition hover:text-white flex items-center gap-1">
              Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {servicesOpen && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-slate-100"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {serviceItems.map((item) => (
                  <a key={item.label} href={item.href}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-[#0066CC]/10 hover:text-[#0066CC] transition">
                    {item.label}
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {/* Mobile: "Réserver" sur page bien, sinon "Mon espace"/"Connexion" */}
          {isBienDetail ? (
            <button
              onClick={scrollToReservation}
              aria-label="Réserver ce bien"
              className="inline-flex md:hidden items-center gap-1.5 rounded-full bg-green-500 hover:bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 animate-pulse-soft"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Réserver
            </button>
          ) : isLogged ? (
            <Link href={dashboardHref}
              className="inline-flex md:hidden items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100 shadow-sm">
              Mon espace
            </Link>
          ) : (
            <a href="/login"
              className="inline-flex md:hidden items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100 shadow-sm">
              Connexion
            </a>
          )}

          {/* Desktop: "Mon espace" si connecté, sinon "Connexion" ghost */}
          {isLogged ? (
            <Link href={dashboardHref}
              className="hidden md:inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100 shadow-sm">
              Mon espace
            </Link>
          ) : (
            <a href="/login"
              className={`hidden md:inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                scrolled ? "text-white/80 hover:text-white" : "text-white/70 hover:text-white"
              }`}>
              Connexion
            </a>
          )}

          {/* Desktop only: Contact */}
          <a href="/#contact"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100 shadow-sm">
            Contact
          </a>

          {/* Desktop only: Réserver (uniquement page bien) */}
          {isBienDetail && (
            <button
              onClick={scrollToReservation}
              aria-label="Réserver ce bien"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 animate-pulse-soft"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Réserver ce bien
            </button>
          )}

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-[#0066CC] border-t border-white/10 px-6 pb-4"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-white/85 hover:text-white border-b border-white/10">
              {item.label}
            </a>
          ))}

          {/* Services mobile */}
          <div className="border-b border-white/10">
            <button onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full text-left py-2.5 text-sm font-medium text-white/85 hover:text-white flex items-center justify-between">
              Services
              <svg className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="bg-white/10 py-2">
                {serviceItems.map((item) => (
                  <a key={item.label} href={item.href}
                    onClick={() => { setMenuOpen(false); setServicesOpen(false); }}
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/#contact" onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-white/85 hover:text-white border-b border-white/10">
            Contact
          </a>

          {isLogged ? (
            <Link href={dashboardHref} onClick={() => setMenuOpen(false)}
              className="block mt-2 py-2.5 text-sm font-medium text-white/85 hover:text-white">
              Mon espace
            </Link>
          ) : (
            <a href="/login" className="block mt-2 py-2.5 text-sm font-medium text-white/70 hover:text-white">
              Connexion
            </a>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
