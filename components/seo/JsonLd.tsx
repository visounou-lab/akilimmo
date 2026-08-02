/**
 * Données structurées Schema.org (JSON-LD) pour AKIL IMMO.
 * Aide Google à comprendre la marque et les annonces (résultats enrichis).
 */

const SITE = "https://www.akilimmo.com";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu est construit côté serveur à partir de nos propres données.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Entité de marque — agence immobilière (site-wide). */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE}/#organization`,
  name: "AKIL IMMO",
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/og-image.jpg`,
  description:
    "Agence immobilière de confiance en Côte d'Ivoire et au Bénin : location meublée, gestion locative et suivi à distance.",
  slogan: "Vous êtes loin, nous sommes là.",
  areaServed: [
    { "@type": "City", name: "Abidjan" },
    { "@type": "City", name: "Cotonou" },
    { "@type": "City", name: "Abomey-Calavi" },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2250710259146",
      contactType: "customer service",
      areaServed: "CI",
      availableLanguage: ["fr"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+2290197598682",
      contactType: "customer service",
      areaServed: "BJ",
      availableLanguage: ["fr"],
    },
  ],
  email: "info@akilimmo.com",
  sameAs: ["https://web.facebook.com/people/Akil-Immo-CI/61588983170173/"],
};

/** Le site lui-même (permet le sitelinks searchbox / identité du site). */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "AKIL IMMO",
  inLanguage: "fr",
  publisher: { "@id": `${SITE}/#organization` },
};
