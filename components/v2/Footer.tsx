"use client";

import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

const NAV_COLUMNS = [
  {
    title: "Biens",
    links: [
      { label: "Acheter", href: "#biens" },
      { label: "Louer", href: "#biens" },
      { label: "Gérer mon bien", href: "#comment-ca-marche" },
    ],
  },
  {
    title: "AKIL IMMO",
    links: [
      { label: "Comment ça marche", href: "#comment-ca-marche" },
      { label: "Témoignages", href: "#" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
  {
    title: "Pays couverts",
    links: [
      { label: "Côte d'Ivoire — Abidjan", href: "#biens" },
      { label: "Bénin — Cotonou", href: "#biens" },
      { label: "Bénin — Abomey-Calavi", href: "#biens" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Pied de page AKIL IMMO"
      style={{ backgroundColor: "#134E4A", color: "#CCFBF1" }}
    >
      {/* CTA band */}
      <div
        className="py-14 text-center px-4"
        id="contact"
        style={{ backgroundColor: "#0F766E" }}
      >
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl mb-4"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700,
            color: "#F0FDFA",
            letterSpacing: "-0.02em",
          }}
        >
          Commencez votre projet immobilier
        </h2>
        <p
          className="mb-8 max-w-md mx-auto text-base"
          style={{
            fontFamily: "var(--font-josefin), sans-serif",
            fontWeight: 300,
            color: "#CCFBF1",
          }}
        >
          Un conseiller dédié vous répond sous 24h. Zéro engagement, zéro frais cachés.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/22900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-6 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              backgroundColor: "#0369A1",
              color: "#ffffff",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0284C7";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0369A1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            Écrire sur WhatsApp
          </a>
          <a
            href="mailto:contact@akilimmo.com"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-6 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-josefin), sans-serif",
              backgroundColor: "transparent",
              color: "#F0FDFA",
              border: "2px solid rgba(20,184,166,0.6)",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#14B8A6";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(20,184,166,0.6)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Mail size={16} aria-hidden="true" />
            Envoyer un email
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="text-xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                color: "#F0FDFA",
                letterSpacing: "0.05em",
              }}
            >
              AKIL IMMO
            </p>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{
                fontFamily: "var(--font-josefin), sans-serif",
                fontWeight: 300,
                color: "#CCFBF1",
                opacity: 0.8,
              }}
            >
              Vous êtes loin, nous sommes là.
              <br />
              Votre agence immobilière de confiance
              en Côte d&apos;Ivoire et au Bénin.
            </p>

            {/* Contact info */}
            <ul className="space-y-2 text-xs" style={{ fontFamily: "var(--font-josefin), sans-serif" }}>
              <li className="flex items-center gap-2" style={{ color: "#CCFBF1" }}>
                <Phone size={12} aria-hidden="true" style={{ color: "#14B8A6", flexShrink: 0 }} />
                +229 00 00 00 00
              </li>
              <li className="flex items-center gap-2" style={{ color: "#CCFBF1" }}>
                <Mail size={12} aria-hidden="true" style={{ color: "#14B8A6", flexShrink: 0 }} />
                contact@akilimmo.com
              </li>
              <li className="flex items-start gap-2" style={{ color: "#CCFBF1" }}>
                <MapPin size={12} aria-hidden="true" style={{ color: "#14B8A6", flexShrink: 0, marginTop: 2 }} />
                Cotonou, Bénin · Abidjan, CI
              </li>
            </ul>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{
                  fontFamily: "var(--font-josefin), sans-serif",
                  color: "#14B8A6",
                }}
              >
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm cursor-pointer transition-colors duration-150"
                      style={{
                        fontFamily: "var(--font-josefin), sans-serif",
                        fontWeight: 300,
                        color: "rgba(204,251,241,0.75)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F0FDFA")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(204,251,241,0.75)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(20,184,166,0.2)",
            fontFamily: "var(--font-josefin), sans-serif",
            color: "rgba(204,251,241,0.5)",
          }}
        >
          <p>© {year} AKIL IMMO. Tous droits réservés.</p>
          <p>Côte d&apos;Ivoire · Bénin · Diaspora africaine</p>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/22900000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter AKIL IMMO sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
        style={{
          width: 56,
          height: 56,
          backgroundColor: "#16A34A",
          boxShadow: "0 4px 14px rgba(22,163,74,0.45)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 6px 20px rgba(22,163,74,0.60)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 14px rgba(22,163,74,0.45)";
        }}
      >
        <MessageCircle size={24} color="#ffffff" aria-hidden="true" />
      </a>
    </footer>
  );
}
