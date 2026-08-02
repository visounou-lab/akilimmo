import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion locative professionnelle",
  description: "Confiez la gestion de vos biens en Côte d'Ivoire et au Bénin à AKIL IMMO : encaissement des loyers, relances, états des lieux et rapports mensuels, où que vous soyez.",
  alternates: { canonical: "https://www.akilimmo.com/services/gestion-locative" },
  openGraph: {
    title: "Gestion locative professionnelle | AKIL IMMO",
    description: "Confiez la gestion de vos biens en Côte d'Ivoire et au Bénin à AKIL IMMO : encaissement des loyers, relances, états des lieux et rapports mensuels, où que vous soyez.",
    url: "https://www.akilimmo.com/services/gestion-locative",
  },
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
