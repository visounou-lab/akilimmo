import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslator } from "@/lib/i18n";
import {
  isRouteLocale,
  localeConfig,
  routeLocales,
  type RouteLocale,
} from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routeLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};
  const t = getTranslator(locale);

  // hreflang alternates for every locale + x-default.
  const languages: Record<string, string> = { "x-default": `${SITE_URL}/de` };
  for (const rl of routeLocales) {
    languages[localeConfig[rl].bcp47] = `${SITE_URL}/${rl}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("meta.siteName"), template: `%s · ${t("meta.siteName")}` },
    description: t("meta.description"),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      title: t("meta.tagline"),
      description: t("meta.description"),
      siteName: t("meta.siteName"),
      locale: localeConfig[locale].bcp47,
      type: "website",
      url: `${SITE_URL}/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();
  const routeLocale = locale as RouteLocale;

  return (
    <html lang={localeConfig[routeLocale].bcp47}>
      <body>
        <a
          href="#main"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
          className="sand-skip"
        >
          ↓
        </a>
        <Header locale={routeLocale} />
        <main id="main">{children}</main>
        <Footer locale={routeLocale} />
      </body>
    </html>
  );
}
