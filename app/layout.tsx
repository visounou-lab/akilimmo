import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AnalyticsConsent from "./components/AnalyticsConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.akilimmo.com"),
  title: {
    default: "AKIL IMMO — Location Appartements & Villas au Bénin et Côte d'Ivoire",
    template: "%s | AKIL IMMO",
  },
  description:
    "Trouvez votre appartement ou villa meublée à Cotonou, Abomey-Calavi et Abidjan. Location courte et longue durée. Gestion locative professionnelle.",
  keywords: [
    "location appartement Cotonou",
    "location villa Abidjan",
    "immobilier Bénin",
    "location meublée Côte d'Ivoire",
    "AKIL IMMO",
  ],
  authors: [{ name: "AKIL IMMO" }],
  creator: "AKIL IMMO",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.akilimmo.com",
    siteName: "AKIL IMMO",
    title: "AKIL IMMO — Location Appartements & Villas au Bénin et Côte d'Ivoire",
    description:
      "Trouvez votre appartement ou villa meublée à Cotonou, Abomey-Calavi et Abidjan.",
    images: [
      {
        url: "https://www.akilimmo.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AKIL IMMO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AKIL IMMO — Location au Bénin et Côte d'Ivoire",
    description: "Appartements et villas meublées à Cotonou et Abidjan.",
    images: ["https://www.akilimmo.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.akilimmo.com",
  },
  verification: {
    google: [
      "vJrgCkTnDkAHuO0Ml0HDX8uud9WxemENqUZGVMRLTrE",
      "ZtaM7Xo46vkb5lQVeY4MtywFBnFdz9bnnXA-5P-Vrr0",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full bg-slate-50 text-slate-900" style={{ colorScheme: "light" }}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18250749686"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18250749686');
            gtag('event', 'conversion', {
              'send_to': 'AW-18250749686/dR1yCPekhcIcEPat0f5D',
              'value': 1.0,
              'currency': 'USD'
            });
            window.gtag_report_conversion = function(url) {
              var callback = function () {
                if (typeof(url) !== 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-18250749686/dR1yCPekhcIcEPat0f5D',
                'value': 1.0,
                'currency': 'USD',
                'event_callback': callback
              });
              return false;
            };
          `}
        </Script>
        <Providers>{children}</Providers>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
