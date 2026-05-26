"use client";

import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import WaCountryPicker from "./WaCountryPicker";
import WhatsAppButton from "../../app/components/WhatsAppButton";

function WhatsAppFloating() {
  return <WhatsAppButton />;
}

const NAV_COLUMNS = [
  {
    title: "Biens",
    links: [
      { label: "Louer (long séjour)", href: "#biens" },
      { label: "Court séjour", href: "#biens" },
      { label: "Tous nos biens", href: "#biens" },
    ],
  },
  {
    title: "AKIL IMMO",
    links: [
      { label: "Comment ça marche", href: "/comment-ca-marche" },
      { label: "Témoignages", href: "#" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
  {
    title: "Partenaires",
    links: [
      { label: "Devenir partenaire", href: "/inscription" },
      { label: "Espace propriétaire", href: "#" },
      { label: "Espace agence", href: "#" },
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
    <footer aria-label="Pied de page AKIL IMMO">
      {/* CTA band */}
      <div
        id="contact"
        className="py-16 px-4 text-center"
        style={{ backgroundColor: "#1B4D3E" }}
      >
        {/* Gold ornament */}
        <div
          className="mx-auto mb-6 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
          <span
            style={{
              display: "block",
              width: 8,
              height: 8,
              backgroundColor: "#C8922A",
              borderRadius: "50%",
              opacity: 0.8,
            }}
          />
          <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
        </div>

        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
            color: "#FDFCF8",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Parlons de votre projet
        </h2>
        <p
          className="mb-8 mx-auto max-w-xl text-base"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            color: "rgba(253,252,248,0.7)",
            lineHeight: 1.75,
          }}
        >
          Locataire à la recherche d&apos;un meublé, propriétaire ou agence partenaire
          — un conseiller AKIL IMMO vous répond sous 24h. Zéro engagement, zéro frais cachés.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <WaCountryPicker
            message="Bonjour, je souhaite en savoir plus sur AKIL IMMO"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "#E07B39",
              color: "#ffffff",
              boxShadow: "0 4px 16px rgba(224,123,57,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C96A28";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E07B39";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            Écrire sur WhatsApp
          </WaCountryPicker>
          <a
            href="mailto:info@akilimmo.com"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-7 py-3.5 text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "#FDFCF8",
              border: "1.5px solid rgba(200,146,42,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8922A";
              e.currentTarget.style.color = "#C8922A";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200,146,42,0.5)";
              e.currentTarget.style.color = "#FDFCF8";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Mail size={16} aria-hidden="true" />
            Envoyer un email
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div
        style={{ backgroundColor: "#1C1917" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-10 md:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span
                  style={{
                    display: "block",
                    width: 3,
                    height: 22,
                    backgroundColor: "#C8922A",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#FDFCF8",
                    letterSpacing: "0.06em",
                  }}
                >
                  AKIL IMMO
                </p>
              </div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  color: "rgba(253,252,248,0.55)",
                  lineHeight: 1.75,
                }}
              >
                Vous êtes loin, nous sommes là.
                <br />
                Votre agence immobilière de confiance
                en Côte d&apos;Ivoire et au Bénin.
              </p>

              <ul className="space-y-2.5 text-xs">
                {[
                  { Icon: Phone, text: "+229 01 97 59 86 82 (Bénin)" },
                  { Icon: Phone, text: "+225 07 10 25 91 46 (CI)" },
                  { Icon: Mail, text: "info@akilimmo.com" },
                  { Icon: MapPin, text: "Abomey-Calavi, Tokan, Bénin · Abidjan, Côte d'Ivoire" },
                ].map(({ Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-2"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      color: "rgba(253,252,248,0.5)",
                    }}
                  >
                    <Icon
                      size={12}
                      aria-hidden="true"
                      style={{ color: "#C8922A", flexShrink: 0, marginTop: 2 }}
                    />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nav columns */}
            {NAV_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3
                  className="text-xs font-medium tracking-widest uppercase mb-5"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "#C8922A",
                    letterSpacing: "0.12em",
                  }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm cursor-pointer transition-colors duration-150"
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontWeight: 300,
                          color: "rgba(253,252,248,0.5)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#FDFCF8")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(253,252,248,0.5)")
                        }
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
              borderTop: "1px solid rgba(200,146,42,0.15)",
              fontFamily: "var(--font-inter), sans-serif",
              color: "rgba(253,252,248,0.3)",
            }}
          >
            <p>© {year} AKIL IMMO. Tous droits réservés.</p>
            <p>Côte d&apos;Ivoire · Bénin · Diaspora africaine</p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button — pays sélectionnable */}
      <WhatsAppFloating />
    </footer>
  );
}
