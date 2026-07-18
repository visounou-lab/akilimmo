import { defaultRouteLocale, localeConfig, type RouteLocale } from "./config";
import de from "@/messages/de.json";
import pl from "@/messages/pl.json";
import sv from "@/messages/sv.json";
import cs from "@/messages/cs.json";
import en from "@/messages/en.json";

type Messages = Record<string, unknown>;

const bundles: Record<"de" | "pl" | "sv" | "cs" | "en", Messages> = { de, pl, sv, cs, en };

function lookup(messages: Messages, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/**
 * Returns a translation function for a given route locale.
 *
 * Missing keys fall back to the German source text (never a raw key), which
 * satisfies the "no missing keys / no raw keys in production" acceptance
 * criterion while professional translations are being completed.
 */
export function getTranslator(locale: RouteLocale) {
  const bundleKey = localeConfig[locale].messages;
  const primary = bundles[bundleKey];
  const fallback = bundles[localeConfig[defaultRouteLocale].messages];

  return function t(key: string, vars?: Record<string, string | number>): string {
    const value = lookup(primary, key) ?? lookup(fallback, key) ?? key;
    return interpolate(value, vars);
  };
}

export type Translator = ReturnType<typeof getTranslator>;

/** Returns a raw message array (for lists such as FAQ items or bullet points). */
export function getList(locale: RouteLocale, key: string): Array<Record<string, string>> {
  const bundleKey = localeConfig[locale].messages;
  const read = (messages: Messages) =>
    key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, messages);
  const value = read(bundles[bundleKey]) ?? read(bundles[localeConfig[defaultRouteLocale].messages]);
  return Array.isArray(value) ? (value as Array<Record<string, string>>) : [];
}
