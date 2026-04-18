import type { Metadata } from "next";
import InscriptionClient from "./_components/InscriptionClient";

export const metadata: Metadata = {
  title: "Devenir propriétaire partenaire",
  description:
    "Confiez la gestion de votre bien à AKIL IMMO. Inscription propriétaire simple et rapide.",
};

export default function InscriptionPage() {
  return <InscriptionClient />;
}
