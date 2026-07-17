import Link from "next/link";
import { getTranslator } from "@/lib/i18n";
import { defaultRouteLocale } from "@/lib/i18n/config";

/**
 * Root not-found boundary. It renders its own <html>/<body> because it can be
 * shown for paths outside the [locale] segment (which owns the normal shell).
 * German is used as the source-language fallback.
 */
export default function NotFound() {
  const t = getTranslator(defaultRouteLocale);
  return (
    <html lang="de-DE">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f6f8fc", color: "#111827" }}>
        <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center", padding: "2rem" }}>
          <div>
            <p style={{ fontSize: "3rem", fontWeight: 800, color: "#18305f" }}>404</p>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>{t("notFound.title")}</h1>
            <p style={{ marginTop: "0.75rem", color: "#55617a" }}>{t("notFound.text")}</p>
            <Link
              href={`/${defaultRouteLocale}`}
              style={{ display: "inline-block", marginTop: "1.5rem", background: "#2666eb", color: "#fff", padding: "0.75rem 1.4rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}
            >
              {t("notFound.home")}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
