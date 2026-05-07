"use client";

import { useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import CookieBanner, { type ConsentState } from "./CookieBanner";

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("akil_cookie_consent") as ConsentState) ?? null;
  });

  return (
    <>
      <CookieBanner onConsent={setConsent} />
      {consent === "accepted" && (
        <>
          <GoogleAnalytics gaId="G-3DEL10SDZJ" />
          {process.env.NODE_ENV === "production" && (
            <>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-17185310519"
                strategy="afterInteractive"
              />
              <Script id="google-ads-config" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-17185310519');
                `}
              </Script>
            </>
          )}
        </>
      )}
    </>
  );
}
