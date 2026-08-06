// =============================================================================
// Impressum — Boreal Finance Group AG (contenu ALLEMAND faisant foi).
// Données d'entreprise confirmées et approuvées par le responsable du projet.
// La section « Zuständige Aufsichtsbehörden » identifie les autorités
// compétentes du secteur ; elle n'affirme aucun agrément ni supervision.
// =============================================================================

export const IMPRESSUM_COMPANY = {
  name: "Boreal Finance Group AG",
  addressLines: [
    "Wilhelm-Bötzkes-Straße 3",
    "40474 Düsseldorf-Stadtbezirk 1",
    "Deutschland",
  ],
  sitz: "Düsseldorf",
  handelsregister: "Amtsgericht Düsseldorf, HRB 1130",
  ustId: "DE 121298843",
  blz: "30010400",
  giin: "Q2NIGV.00000.LE.276",
};

export interface Authority {
  name: string;
  addressBlocks: string[][];
  website: { label: string; href: string };
}

export const IMPRESSUM_AUTHORITIES: Authority[] = [
  {
    name: "Bundesanstalt für Finanzdienstleistungsaufsicht – BaFin",
    addressBlocks: [
      ["Graurheindorfer Straße 108", "53117 Bonn"],
      ["Marie-Curie-Straße 24–28", "60439 Frankfurt am Main"],
    ],
    website: { label: "www.bafin.de", href: "https://www.bafin.de" },
  },
  {
    name: "Europäische Zentralbank – EZB",
    addressBlocks: [["Sonnemannstraße 22", "60314 Frankfurt am Main"]],
    website: { label: "www.ecb.europa.eu", href: "https://www.ecb.europa.eu" },
  },
];

/** German prose blocks (authoritative). Each string is a paragraph. */
export const IMPRESSUM_PROSE = {
  liabilityContent: [
    "Die Inhalte dieser Seiten wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.",
    "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
  ],
  liabilityLinks: [
    "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
    "Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
  ],
  copyright: [
    "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
  ],
  disputeResolution: [
    "Die Europäische Kommission stellt keine Plattform zur Online-Streitbeilegung (OS-Plattform) mehr bereit.",
    "Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet.",
  ],
  dataProtection: [
    "Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer Datenschutzerklärung.",
  ],
};
