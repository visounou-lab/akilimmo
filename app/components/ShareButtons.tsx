"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  price: number;
  city?: string | null;
};

export default function ShareButtons({ url, title, price, city }: Props) {
  const [copied, setCopied] = useState(false);

  const prixFCFA = new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  const cityPart = city ? ` — ${city}` : "";

  const waText = `🏠 ${title}${cityPart}\n💰 ${prixFCFA}\n\n👉 ${url}\n\nVia AKIL IMMO`;
  const tweetText = `${title} — AKIL IMMO`;
  const emailSubject = `AKIL IMMO — ${title}`;
  const emailBody =
    `Bonjour,\n\nJe vous partage ce bien :\n\n${title}${cityPart}\nPrix : ${prixFCFA}\n\n${url}\n\nCordialement.`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    try {
      await navigator.share({ title: `AKIL IMMO — ${title}`, text: `${title} — ${prixFCFA}`, url });
    } catch {
      // cancelled by user — do nothing
    }
  }

  const btnClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition hover:brightness-110";

  return (
    <section aria-label="Partager ce bien" className="py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-medium text-gray-700">Partager :</span>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur WhatsApp"
          className={btnClass}
          style={{ backgroundColor: "#25D366" }}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L.057 23.571a.75.75 0 00.921.921l5.723-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 01-4.951-1.355l-.355-.212-3.695.949.966-3.594-.232-.371A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
          </svg>
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur Facebook"
          className={btnClass}
          style={{ backgroundColor: "#1877F2" }}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur X"
          className={`${btnClass} bg-black`}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur LinkedIn"
          className={btnClass}
          style={{ backgroundColor: "#0A66C2" }}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          aria-label="Partager par email"
          className={`${btnClass} bg-gray-700`}
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 4.5A2.25 2.25 0 013.75 2.25h16.5A2.25 2.25 0 0122.5 4.5v15a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 19.5v-15zm2.25-.75a.75.75 0 00-.75.75v.51l9 5.25 9-5.25V4.5a.75.75 0 00-.75-.75H3.75zM21 6.976l-8.609 5.022a.75.75 0 01-.782 0L3 6.976V19.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V6.976z" />
          </svg>
          Email
        </a>

        {/* Copier le lien */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copier le lien"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied ? "Copié !" : "Copier le lien"}
        </button>

        {/* Partager... (mobile only) */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Partager via le système"
          className={`${btnClass} bg-gray-900 sm:hidden`}
        >
          <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager...
        </button>
      </div>
    </section>
  );
}
