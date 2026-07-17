import type { ReactNode } from "react";

export function Section({
  children,
  muted = false,
  id,
}: {
  children: ReactNode;
  muted?: boolean;
  id?: string;
}) {
  return (
    <section id={id} style={{ paddingBlock: "clamp(2.5rem, 6vw, 4.5rem)", background: muted ? "#fff" : "transparent" }}>
      <div className="sand-container">{children}</div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header style={{ maxWidth: "62ch" }}>
      {eyebrow && <p className="sand-eyebrow" style={{ marginBottom: "0.6rem" }}>{eyebrow}</p>}
      <h1 style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-sand-navy)", lineHeight: 1.1 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "var(--color-sand-muted)", lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ maxWidth: "58ch", marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.01em", color: "var(--color-sand-navy)" }}>
        {title}
      </h2>
      {subtitle && <p style={{ marginTop: "0.75rem", color: "var(--color-sand-muted)", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

export function PlaceholderBadge({ text }: { text: string }) {
  return (
    <p
      role="note"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.8rem",
        color: "#8a5a00",
        background: "#fff5e6",
        border: "1px solid #ffd699",
        borderRadius: "10px",
        padding: "0.5rem 0.8rem",
        marginTop: "1rem",
      }}
    >
      ⚠︎ {text}
    </p>
  );
}
