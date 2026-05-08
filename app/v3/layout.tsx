import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

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
  title: "AKIL IMMO — Vous êtes loin, nous sommes là",
  description:
    "Agence immobilière de confiance en Côte d'Ivoire et au Bénin. Location et achat de biens pour la diaspora africaine.",
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfair.variable} ${inter.variable}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        backgroundColor: "#FDFCF8",
        color: "#1C1917",
      }}
    >
      {children}
    </div>
  );
}
