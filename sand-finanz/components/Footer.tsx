import Link from "next/link";
import type { RouteLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";
import { href, legalNav, servicesNav } from "@/lib/nav";
import { Logo } from "./Logo";

export function Footer({ locale }: { locale: RouteLocale }) {
  const t = getTranslator(locale);
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--color-sand-navy)", color: "#dfe7f6", marginTop: "4rem" }}>
      <div className="sand-container" style={{ paddingBlock: "3rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <Logo variant="light" />
            <p style={{ marginTop: "0.9rem", maxWidth: "34ch", fontSize: "0.9rem", opacity: 0.85 }}>
              {t("footer.aboutText")}
            </p>
          </div>

          <nav aria-label="services">
            <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>
              {t("footer.servicesTitle")}
            </h2>
            <ul style={{ listStyle: "none", marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
              {servicesNav.map((item) => (
                <li key={item.slug}>
                  <Link href={href(locale, item.slug)} style={{ color: "#dfe7f6", textDecoration: "none", fontSize: "0.9rem" }}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="legal">
            <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>
              {t("footer.legalTitle")}
            </h2>
            <ul style={{ listStyle: "none", marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
              {legalNav.map((item) => (
                <li key={item.slug}>
                  <Link href={href(locale, item.slug)} style={{ color: "#dfe7f6", textDecoration: "none", fontSize: "0.9rem" }}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          style={{
            marginTop: "2rem",
            paddingTop: "1.2rem",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            fontSize: "0.82rem",
            opacity: 0.8,
          }}
        >
          {t("footer.responsibleCredit")}
        </p>
        <p style={{ marginTop: "0.6rem", fontSize: "0.78rem", opacity: 0.55 }}>
          {t("footer.legalEntityPlaceholder")}
        </p>
        <p style={{ marginTop: "0.8rem", fontSize: "0.8rem", opacity: 0.65 }}>
          © {year} {t("meta.siteName")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
