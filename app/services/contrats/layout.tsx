import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contrats sécurisés & documents",
  description: "Des contrats de location clairs et sécurisés, gérés de bout en bout par AKIL IMMO pour propriétaires et locataires au Bénin et en Côte d'Ivoire.",
  alternates: { canonical: "https://www.akilimmo.com/services/contrats" },
  openGraph: {
    title: "Contrats sécurisés & documents | AKIL IMMO",
    description: "Des contrats de location clairs et sécurisés, gérés de bout en bout par AKIL IMMO pour propriétaires et locataires au Bénin et en Côte d'Ivoire.",
    url: "https://www.akilimmo.com/services/contrats",
  },
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
