"use client";

export default function BreadcrumbV3({ title }: { title: string }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      style={{ borderBottom: "1px solid #E8DDD0", backgroundColor: "#FDFCF8" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-1.5">
        {(
          [
            { label: "Accueil", href: "/v3" },
            { label: "Biens", href: "/v3/biens" },
          ] as const
        ).map(({ label, href }) => (
          <span key={href} className="flex items-center gap-1.5">
            <a
              href={href}
              className="text-sm transition-colors duration-150"
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B5E52")}
            >
              {label}
            </a>
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "#C0B5AB",
                fontSize: "0.875rem",
              }}
            >
              ›
            </span>
          </span>
        ))}
        <span
          className="text-sm font-medium truncate max-w-xs"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#C8922A" }}
        >
          {title}
        </span>
      </div>
    </nav>
  );
}
