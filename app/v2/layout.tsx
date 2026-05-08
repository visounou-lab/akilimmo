import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AKIL IMMO — Vous êtes loin, nous sommes là",
  description:
    "Agence immobilière de confiance en Côte d'Ivoire et au Bénin. Location et achat de biens pour la diaspora africaine.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cinzel.variable} ${josefinSans.variable}`}
      style={{
        fontFamily: "var(--font-josefin), sans-serif",
        backgroundColor: "#F0FDFA",
        color: "#134E4A",
      }}
    >
      {children}
    </div>
  );
}
