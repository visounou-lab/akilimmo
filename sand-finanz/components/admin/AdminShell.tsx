import Link from "next/link";
import type { Role, User } from "@prisma/client";
import { can, ROLE_LABELS, type Permission } from "@/lib/auth/rbac";
import { logoutAction } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

const NAV: Array<{ href: string; label: string; perm: Permission }> = [
  { href: "/admin", label: "Dashboard", perm: "applications.view" },
  { href: "/admin/applications", label: "Anträge", perm: "applications.view" },
  { href: "/admin/credit-products", label: "Kreditparameter", perm: "creditProducts.view" },
  { href: "/admin/einstellungen", label: "Einstellungen", perm: "settings.manage" },
  { href: "/admin/zugang", label: "Zugang", perm: "applications.view" },
  { href: "/admin/audit", label: "Audit-Log", perm: "audit.view" },
];

export function AdminShell({
  user,
  active,
  children,
}: {
  user: Pick<User, "name" | "email" | "role">;
  active: string;
  children: React.ReactNode;
}) {
  const role = user.role as Role;
  const items = NAV.filter((n) => can(role, n.perm));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          width: "240px",
          background: "var(--color-sand-navy)",
          color: "#dfe7f6",
          padding: "1.25rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <Logo variant="light" />
        </Link>
        <nav style={{ display: "grid", gap: "0.25rem" }}>
          {items.map((n) => {
            const isActive = active === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "0.92rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "#c7d5ef",
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", fontSize: "0.8rem" }}>
          <div style={{ fontWeight: 600, color: "#fff" }}>{user.name}</div>
          <div style={{ opacity: 0.7 }}>{user.email}</div>
          <div style={{ opacity: 0.7, marginTop: "0.15rem" }}>{ROLE_LABELS[role]}</div>
          <form action={logoutAction} style={{ marginTop: "0.75rem" }}>
            <button
              type="submit"
              className="sand-btn"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff", width: "100%", fontSize: "0.85rem" }}
            >
              Abmelden
            </button>
          </form>
        </div>
      </aside>

      <div style={{ padding: "1.75rem 2rem", maxWidth: "1100px" }}>{children}</div>
    </div>
  );
}
