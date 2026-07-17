"use client";

import { useState } from "react";
import { Printer, Link2, ArrowLeft } from "lucide-react";

export default function CertificatActions({ pageUrl, terrainUrl }: { pageUrl: string; terrainUrl: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4">
      <a
        href={terrainUrl}
        className="inline-flex items-center gap-1.5 text-sm"
        style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Retour au terrain
      </a>
      <div className="flex items-center gap-3">
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#1B4D3E", border: "1.5px solid #1B4D3E", backgroundColor: "transparent" }}
        >
          <Link2 size={15} aria-hidden="true" />
          {copied ? "Lien copié ✓" : "Copier le lien"}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition"
          style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C8922A", color: "#ffffff" }}
        >
          <Printer size={15} aria-hidden="true" />
          Télécharger en PDF
        </button>
      </div>
    </div>
  );
}
