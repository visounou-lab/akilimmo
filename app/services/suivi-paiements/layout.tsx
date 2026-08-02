import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivi des paiements de loyers",
  description: "Suivez vos loyers en toute transparence avec AKIL IMMO : encaissements, relances automatiques et historique clair pour propriétaires à distance.",
  alternates: { canonical: "https://www.akilimmo.com/services/suivi-paiements" },
  openGraph: {
    title: "Suivi des paiements de loyers | AKIL IMMO",
    description: "Suivez vos loyers en toute transparence avec AKIL IMMO : encaissements, relances automatiques et historique clair pour propriétaires à distance.",
    url: "https://www.akilimmo.com/services/suivi-paiements",
  },
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
