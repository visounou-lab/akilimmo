"use client";

import { Mail, Phone } from "lucide-react";

interface Props {
  waNumber: string;
  phoneDisplay: string;
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#C8922A",
  marginBottom: 6,
};

const card: React.CSSProperties = {
  backgroundColor: "#FDFCF8",
  border: "1.5px solid rgba(200,146,42,0.35)",
  borderRadius: 16,
  padding: "1.5rem",
  boxShadow: "0 2px 12px rgba(28,25,23,0.06)",
};

export default function ContactCardV3({ waNumber, phoneDisplay }: Props) {
  return (
    <>
      {/* Card contact agence */}
      <div style={card}>
        <p style={sectionTitle}>CONTACTER L&apos;AGENCE</p>
        <h3
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#1C1917",
            marginBottom: "0.5rem",
          }}
        >
          Une question ?
        </h3>
        <p
          className="mb-5 text-sm"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            color: "#6B5E52",
            lineHeight: 1.6,
          }}
        >
          Nous répondons rapidement à toutes vos demandes.
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <a
              href="mailto:info@akilimmo.com"
              className="flex items-center gap-2 transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#3D3530" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3D3530")}
            >
              <Mail size={14} aria-hidden="true" style={{ color: "#C8922A", flexShrink: 0 }} />
              info@akilimmo.com
            </a>
          </li>
          <li>
            <a
              href={`tel:${waNumber}`}
              className="flex items-center gap-2 transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#3D3530" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3D3530")}
            >
              <Phone size={14} aria-hidden="true" style={{ color: "#C8922A", flexShrink: 0 }} />
              {phoneDisplay}
            </a>
          </li>
        </ul>
      </div>

      {/* Bouton retour */}
      <a
        href="/biens"
        className="flex items-center justify-center gap-2 cursor-pointer rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 400,
          fontSize: "0.875rem",
          color: "#6B5E52",
          padding: "0.75rem 1.5rem",
          border: "1.5px solid #E8DDD0",
          backgroundColor: "#FDFCF8",
          ["--tw-ring-color" as string]: "#C8922A",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#C8922A";
          e.currentTarget.style.color = "#C8922A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#E8DDD0";
          e.currentTarget.style.color = "#6B5E52";
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          width={14}
          height={14}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux biens
      </a>
    </>
  );
}
