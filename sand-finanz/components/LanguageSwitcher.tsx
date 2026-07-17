"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { routeLocales, localeConfig, type RouteLocale } from "@/lib/i18n/config";

/** Swaps only the leading locale segment, preserving the rest of the path. */
function swapLocale(pathname: string, next: RouteLocale): string {
  const parts = pathname.split("/");
  // parts[0] === "" ; parts[1] === current locale
  if (parts.length > 1 && (routeLocales as readonly string[]).includes(parts[1])) {
    parts[1] = next;
  } else {
    return `/${next}`;
  }
  return parts.join("/") || `/${next}`;
}

export function LanguageSwitcher({ current, label }: { current: RouteLocale; label: string }) {
  const pathname = usePathname() || `/${current}`;
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="sand-btn sand-btn-ghost"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        style={{ padding: "0.5rem 0.8rem", fontSize: "0.9rem" }}
      >
        {current.toUpperCase()}
        <span aria-hidden="true" style={{ fontSize: "0.7rem" }}>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="sand-card"
          style={{
            position: "absolute",
            right: 0,
            marginTop: "0.4rem",
            padding: "0.35rem",
            minWidth: "170px",
            zIndex: 60,
            listStyle: "none",
          }}
        >
          {routeLocales.map((rl) => (
            <li key={rl}>
              <Link
                href={swapLocale(pathname, rl)}
                hrefLang={localeConfig[rl].bcp47}
                onClick={() => setOpen(false)}
                aria-current={rl === current ? "true" : undefined}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.5rem 0.7rem",
                  borderRadius: "8px",
                  color: rl === current ? "var(--color-sand-cta)" : "var(--color-sand-ink)",
                  fontWeight: rl === current ? 700 : 500,
                  textDecoration: "none",
                }}
              >
                <span>{localeConfig[rl].label}</span>
                <span style={{ color: "var(--color-sand-muted)", fontSize: "0.8rem" }}>
                  {rl.toUpperCase()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
