import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    google: "vJrgCkTnDkAHuO0Ml0HDX8uud9WxemENqUZGVMRLTrE",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
