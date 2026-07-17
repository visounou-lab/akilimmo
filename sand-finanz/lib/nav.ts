import type { RouteLocale } from "./i18n/config";

/**
 * Functional slugs. The German slugs are reused across every locale and kept in
 * this single config so links never break. Localised slugs can be introduced
 * later by extending this map per locale without touching the pages.
 */
export const slugs = {
  leistungen: "leistungen",
  kreditrechner: "kreditrechner",
  ablauf: "ablauf",
  unterlagen: "unterlagen",
  ueberUns: "ueber-uns",
  faq: "faq",
  kontakt: "kontakt",
  antrag: "antrag",
  impressum: "impressum",
  datenschutz: "datenschutz",
  cookies: "cookies",
  nutzungsbedingungen: "nutzungsbedingungen",
} as const;

export type SlugKey = keyof typeof slugs;

export function href(locale: RouteLocale, slug?: SlugKey): string {
  if (!slug) return `/${locale}`;
  return `/${locale}/${slugs[slug]}`;
}

/** Primary header navigation (translation key + slug). */
export const primaryNav: Array<{ key: string; slug?: SlugKey }> = [
  { key: "nav.startseite" },
  { key: "nav.leistungen", slug: "leistungen" },
  { key: "nav.kreditrechner", slug: "kreditrechner" },
  { key: "nav.ablauf", slug: "ablauf" },
  { key: "nav.ueberUns", slug: "ueberUns" },
  { key: "nav.kontakt", slug: "kontakt" },
];

export const legalNav: Array<{ key: string; slug: SlugKey }> = [
  { key: "legal.impressum.title", slug: "impressum" },
  { key: "legal.datenschutz.title", slug: "datenschutz" },
  { key: "legal.cookies.title", slug: "cookies" },
  { key: "legal.nutzungsbedingungen.title", slug: "nutzungsbedingungen" },
];

export const servicesNav: Array<{ key: string; slug: SlugKey }> = [
  { key: "nav.leistungen", slug: "leistungen" },
  { key: "nav.kreditrechner", slug: "kreditrechner" },
  { key: "nav.ablauf", slug: "ablauf" },
  { key: "unterlagen.title", slug: "unterlagen" },
  { key: "nav.faq", slug: "faq" },
];
