"use client";

import Link from "next/link";
import { useState } from "react";
import type { RouteLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";
import { href, primaryNav } from "@/lib/nav";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale }: { locale: RouteLocale }) {
  const t = getTranslator(locale);
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "saturate(180%) blur(8px)",
        borderBottom: "1px solid var(--color-sand-border)",
      }}
    >
      <div
        className="sand-container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}
      >
        <Link href={href(locale)} aria-label={t("meta.siteName")} style={{ textDecoration: "none" }}>
          <Logo />
        </Link>

        <nav aria-label="primary" className="sand-nav-desktop" style={{ display: "none", gap: "1.4rem" }}>
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={href(locale, item.slug)}
              style={{ color: "var(--color-sand-ink)", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <LanguageSwitcher current={locale} label={t("nav.language")} />
          <Link href={href(locale, "antrag")} className="sand-btn sand-btn-primary sand-cta-desktop"
            style={{ display: "none", padding: "0.6rem 1.1rem", fontSize: "0.9rem" }}>
            {t("nav.antrag")}
          </Link>
          <button
            type="button"
            className="sand-btn sand-btn-ghost sand-menu-btn"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ padding: "0.5rem 0.7rem" }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="sand-container" style={{ paddingBottom: "1rem" }}>
          <nav aria-label="mobile" style={{ display: "grid", gap: "0.25rem" }}>
            {primaryNav.map((item) => (
              <Link
                key={item.key}
                href={href(locale, item.slug)}
                onClick={() => setOpen(false)}
                style={{ padding: "0.7rem 0.5rem", borderRadius: "8px", textDecoration: "none", color: "var(--color-sand-ink)", fontWeight: 500 }}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link href={href(locale, "antrag")} onClick={() => setOpen(false)} className="sand-btn sand-btn-primary" style={{ marginTop: "0.5rem" }}>
              {t("nav.antrag")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
