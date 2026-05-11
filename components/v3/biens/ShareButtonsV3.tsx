"use client";

import { useState } from "react";

interface Props {
  url: string;
  title: string;
  price: number;
  city: string;
}

const ICON_WA = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.122 1.518 5.854L.057 23.882a.5.5 0 00.61.637l6.198-1.63A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.386l-.36-.213-3.722.979.999-3.646-.234-.375A9.818 9.818 0 1112 21.818z" />
  </svg>
);

const ICON_FB = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const ICON_X = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ICON_LI = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.997 23.227 23.997 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ICON_MAIL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="18" height="18" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ICON_LINK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} width="18" height="18" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ICON_CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="18" height="18" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function ShareButtonsV3({ url, title, price, city }: Props) {
  const [copied, setCopied] = useState(false);

  const prixFmt = new Intl.NumberFormat("fr-FR").format(price) + " XOF";
  const waText = `🏠 ${title} — ${city}\n💰 ${prixFmt}\n\n👉 ${url}\n\nVia AKIL IMMO`;
  const tweetText = `${title} — AKIL IMMO`;
  const emailSubject = `AKIL IMMO — ${title}`;
  const emailBody = `Bonjour,\n\nJe vous partage ce bien :\n\n${title} — ${city}\nPrix : ${prixFmt}\n\n${url}\n\nCordialement.`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1.5px solid rgba(200,146,42,0.45)",
    backgroundColor: "transparent",
    color: "#C8922A",
    cursor: "pointer",
    transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
    flexShrink: 0,
  };

  function IconBtn({
    href,
    label,
    icon,
    onClick,
    isActive,
  }: {
    href?: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
  }) {
    const style: React.CSSProperties = {
      ...btnStyle,
      ...(isActive
        ? { backgroundColor: "#C8922A", color: "#FDFCF8", borderColor: "#C8922A" }
        : {}),
    };
    const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
      if (isActive) return;
      e.currentTarget.style.backgroundColor = "#C8922A";
      e.currentTarget.style.color = "#FDFCF8";
      e.currentTarget.style.borderColor = "#C8922A";
    };
    const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
      if (isActive) return;
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#C8922A";
      e.currentTarget.style.borderColor = "rgba(200,146,42,0.45)";
    };

    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={style}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2"
        >
          {icon}
        </a>
      );
    }
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        style={style}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2"
      >
        {icon}
      </button>
    );
  }

  return (
    <section aria-labelledby="share-heading">
      <p
        id="share-heading"
        className="text-xs font-semibold tracking-widest uppercase mb-4"
        style={{
          color: "#6B5E52",
          fontFamily: "var(--font-inter), sans-serif",
          letterSpacing: "0.12em",
        }}
      >
        PARTAGER CE BIEN
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <IconBtn
          href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
          label="Partager sur WhatsApp"
          icon={ICON_WA}
        />
        <IconBtn
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          label="Partager sur Facebook"
          icon={ICON_FB}
        />
        <IconBtn
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`}
          label="Partager sur X"
          icon={ICON_X}
        />
        <IconBtn
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          label="Partager sur LinkedIn"
          icon={ICON_LI}
        />
        <IconBtn
          href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          label="Partager par email"
          icon={ICON_MAIL}
        />
        <div className="relative">
          <IconBtn
            label={copied ? "Lien copié !" : "Copier le lien"}
            icon={copied ? ICON_CHECK : ICON_LINK}
            onClick={handleCopy}
            isActive={copied}
          />
          {copied && (
            <span
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium pointer-events-none"
              style={{
                backgroundColor: "#1C1917",
                color: "#FDFCF8",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              aria-live="polite"
              role="status"
            >
              Lien copié !
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
