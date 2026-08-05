import { requireUser } from "@/lib/auth/guards";
import { can, ROLE_LABELS } from "@/lib/auth/rbac";
import { AdminShell, type NavItem } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const nav: NavItem[] = [
    { href: "/admin", label: "Tableau de bord", icon: "dashboard" },
    { href: "/admin/demandes", label: "Demandes", icon: "applications" },
  ];
  if (can(user.role, "settings.manage")) {
    nav.push({ href: "/admin/parametres", label: "Paramètres", icon: "settings" });
  }
  if (can(user.role, "users.manage")) {
    nav.push({ href: "/admin/acces", label: "Accès", icon: "access" });
  }
  if (can(user.role, "audit.view")) {
    nav.push({ href: "/admin/journal", label: "Journal d'audit", icon: "audit" });
  }

  return (
    <AdminShell
      nav={nav}
      userName={user.name}
      userRole={ROLE_LABELS[user.role]}
    >
      {children}
    </AdminShell>
  );
}
