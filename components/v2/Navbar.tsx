"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Acheter", href: "#biens" },
  { label: "Louer", href: "#biens" },
  { label: "Gérer", href: "#comment-ca-marche" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#0F766E" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/v2"
            className="flex items-center gap-2 cursor-pointer"
            aria-label="AKIL IMMO — Accueil"
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "0.05em",
                color: "#F0FDFA",
              }}
            >
              AKIL IMMO
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium cursor-pointer transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  color: "#CCFBF1",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F0FDFA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#CCFBF1")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="#contact"
              className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "var(--font-josefin), sans-serif",
                backgroundColor: "#0369A1",
                color: "#ffffff",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0284C7";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0369A1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Phone size={14} aria-hidden="true" />
              Nous contacter
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="md:hidden cursor-pointer rounded-md p-2 transition-colors duration-200"
            style={{ color: "#F0FDFA" }}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 pb-4 pt-2"
          style={{ backgroundColor: "#0F766E", borderColor: "#14B8A6" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium cursor-pointer transition-colors duration-150"
              style={{
                fontFamily: "var(--font-josefin), sans-serif",
                color: "#CCFBF1",
                letterSpacing: "0.04em",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              backgroundColor: "#0369A1",
              color: "#ffffff",
            }}
          >
            <Phone size={14} aria-hidden="true" />
            Nous contacter
          </a>
        </div>
      )}
    </header>
  );
}
