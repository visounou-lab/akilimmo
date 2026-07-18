/**
 * Internationalisation configuration.
 *
 * Source language = German (de). Every new string is authored in German first,
 * then translated. The public routes use the segments /de, /pl, /sv and /cz as
 * required by the plan, while the underlying BCP-47 locale codes follow the
 * conventional forms (note: the /cz route maps to the cs-CZ locale).
 */

export const routeLocales = ["de", "pl", "sv", "cz", "en"] as const;
export type RouteLocale = (typeof routeLocales)[number];

export const defaultRouteLocale: RouteLocale = "de";

/** Maps a public route segment to the message bundle + BCP-47 tag + currency. */
export const localeConfig: Record<
  RouteLocale,
  { messages: "de" | "pl" | "sv" | "cs" | "en"; bcp47: string; label: string; currency: string }
> = {
  de: { messages: "de", bcp47: "de-DE", label: "Deutsch", currency: "EUR" },
  pl: { messages: "pl", bcp47: "pl-PL", label: "Polski", currency: "PLN" },
  sv: { messages: "sv", bcp47: "sv-SE", label: "Svenska", currency: "SEK" },
  cz: { messages: "cs", bcp47: "cs-CZ", label: "Čeština", currency: "CZK" },
  en: { messages: "en", bcp47: "en-GB", label: "English", currency: "EUR" },
};

export function isRouteLocale(value: string | undefined): value is RouteLocale {
  return !!value && (routeLocales as readonly string[]).includes(value);
}
