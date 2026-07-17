/**
 * Original wordmark for SAND FINANZ GRUPPE — a simple typographic lockup with a
 * geometric mark. No third-party logo or asset is used; replace with the
 * official vector logo once provided and approved.
 */
export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const primary = variant === "light" ? "#ffffff" : "var(--color-sand-navy)";
  const accent = "var(--color-sand-cta)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" fill={accent} />
        <path d="M9 21c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4" stroke="#fff" strokeWidth="2.4"
          fill="none" strokeLinecap="round" />
        <path d="M9 15c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4" stroke="#fff" strokeWidth="2.4"
          fill="none" strokeLinecap="round" opacity="0.55" />
      </svg>
      <span style={{ lineHeight: 1 }}>
        <strong style={{ color: primary, fontWeight: 800, letterSpacing: "-0.01em" }}>SAND</strong>
        <span style={{ color: variant === "light" ? "#cfe0ff" : "var(--color-sand-muted)", fontWeight: 600 }}>
          {" "}
          FINANZ
        </span>
      </span>
    </span>
  );
}
