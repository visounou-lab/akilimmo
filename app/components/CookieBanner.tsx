"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "akil_cookie_consent";

export type ConsentState = "accepted" | "declined" | null;

export function useConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>(null);
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    setConsent(stored);
  }, []);
  return consent;
}

export default function CookieBanner({ onConsent }: { onConsent: (v: ConsentState) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    onConsent("accepted");
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    onConsent("declined");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6">
      <div className="mx-auto max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 mb-1">Nous utilisons des cookies 🍪</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            AKIL IMMO utilise Google Analytics pour mesurer l&apos;audience du site.
            Ces cookies nous aident à améliorer votre expérience. Vous pouvez accepter ou refuser.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0066CC] hover:bg-[#004499] rounded-xl transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
