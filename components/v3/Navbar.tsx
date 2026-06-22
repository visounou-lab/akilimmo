"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Louer",    href: "/biens" },
  { label: "Vendre",   href: "#contact" },
  { label: "Voitures", href: "#contact" },
  { label: "Séjours",  href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href.startsWith("#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#1C1917", borderBottom: "1px solid rgba(200,146,42,0.2)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 cursor-pointer"
            aria-label="AKIL IMMO — Accueil"
          >
            {/* Gold accent bar */}
            <span
              style={{
                display: "block",
                width: 4,
                height: 28,
                backgroundColor: "#C8922A",
                borderRadius: 2,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#FDFCF8",
                letterSpacing: "0.06em",
              }}
            >
              AKIL IMMO
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="text-sm cursor-pointer transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: active ? 500 : 400,
                    color: active ? "#C8922A" : "rgba(253,252,248,0.75)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active ? "#C8922A" : "rgba(253,252,248,0.75)")
                  }
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="#contact"
              className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                backgroundColor: "#E07B39",
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C96A28";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#E07B39";
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
            style={{ color: "#FDFCF8" }}
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
          style={{ backgroundColor: "#1C1917", borderColor: "rgba(200,146,42,0.25)" }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className="block py-2.5 text-sm cursor-pointer transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#C8922A" : "rgba(253,252,248,0.8)",
                }}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              backgroundColor: "#E07B39",
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
