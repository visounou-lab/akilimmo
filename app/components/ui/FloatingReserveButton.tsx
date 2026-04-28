"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function FloatingReserveButton() {
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  // Show after 300 px of scroll (rAF throttled)
  useEffect(() => {
    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 300);
        rafId = null;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide when the reservation form is visible in the viewport
  useEffect(() => {
    const form = document.getElementById("reserver-bien");
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  function handleClick() {
    const form = document.getElementById("reserver-bien");
    if (!form) return;
    // 96 px offset = header height (~64 px) + comfortable gap
    const top = form.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const show = scrolled && !formVisible;

  // Wiggle every ~3.5 s (3 s rest + 0.5 s wiggle)
  const wiggle = prefersReduced
    ? {}
    : {
        rotate: [0, 0, -5, 5, -3, 0],
        transition: {
          duration: 3.5,
          times: [0, 0.82, 0.89, 0.94, 0.97, 1],
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    /*
     * Outer div: handles CSS fixed positioning only — no Framer Motion
     * transforms here so Tailwind's -translate-x-1/2 is preserved on mobile.
     */
    <div
      className={`
        fixed z-40
        bottom-6 left-1/2 -translate-x-1/2
        md:bottom-auto md:top-24 md:right-6 md:left-auto md:translate-x-0
      `}
    >
      <AnimatePresence>
        {show && (
          /* Inner motion.div: handles fade-in / slide-up entrance */
          <motion.div
            key="floating-reserve"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleClick}
              aria-label="Aller au formulaire de réservation"
              animate={wiggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                inline-flex items-center gap-2 rounded-full px-6 py-3
                bg-[#00D4F0] text-white font-semibold
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                ${prefersReduced ? "shadow-lg" : "animate-shadow-pulse"}
              `}
            >
              <span aria-hidden="true">📅</span>
              <span>Réserver</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
