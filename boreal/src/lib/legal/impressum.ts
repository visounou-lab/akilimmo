// =============================================================================
// Impressum — Boreal Finance Group AG (contenu ALLEMAND faisant foi).
//
// ⚠️ NON VÉRIFIÉ : les données d'enregistrement et réglementaires ci-dessous
// sont fournies par l'exploitant et n'ont PAS pu être confirmées auprès des
// sources officielles (Handelsregister, BaFin, BCE, VIES). Elles ne doivent
// pas être présentées comme des faits établis avant vérification par un·e
// juriste allemand·e. Aucune supervision BaFin/BCE n'est affirmée.
// =============================================================================

export const IMPRESSUM_PLACEHOLDER =
  "[ANGABE MUSS VOM BETREIBER ERGÄNZT UND GEPRÜFT WERDEN]";

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
    "Hinweise zu einer außergerichtlichen Streitbeilegung sowie zu einer etwaigen Teilnahme- oder Verpflichtungspflicht werden ergänzt, sobald die zuständige Stelle bestätigt ist.",
  ],
  dataProtection: [
    "Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer Datenschutzerklärung.",
  ],
};
