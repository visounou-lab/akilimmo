import type { Metadata } from "next";
import InscriptionFormV3 from "../../components/v3/inscription/InscriptionFormV3";

export const metadata: Metadata = {
  title: "Devenir propriétaire partenaire — AKIL IMMO",
  description:
    "Confiez la gestion de votre bien à AKIL IMMO. Inscription propriétaire simple et rapide en Côte d'Ivoire et au Bénin.",
};

export default function V3InscriptionPage() {
  return <InscriptionFormV3 />;
}
