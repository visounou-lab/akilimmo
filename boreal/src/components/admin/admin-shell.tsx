"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ShieldCheck,
  ScrollText,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BorealMark } from "@/components/layout/logo";
import { logoutAction } from "@/app/admin/auth-actions";

export interface NavItem {
  href: string;
  label: string;
  icon: "dashboard" | "applications" | "settings" | "access" | "audit";
}

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  applications: FileText,
  settings: Settings,
  access: ShieldCheck,
  audit: ScrollText,
};

export function AdminShell({
  nav,
  userName,
  userRole,
  children,
}: {
  nav: NavItem[];
  userName: string;
  userRole: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <BorealMark className="size-8" />
        <div className="leading-tight">
          <div className="font-serif text-sm font-semibold">Boreal Finance</div>
          <div className="text-[0.7rem] text-primary-foreground/60">
            Administration
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="px-3 py-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <LogOut className="size-4.5" />
          Déconnexion
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border p-2 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="text-sm text-muted-foreground">
            Connecté : <span className="font-medium text-foreground">{userName}</span>
            <span className="ml-2 hidden rounded-full bg-secondary px-2 py-0.5 text-xs sm:inline">
              {userRole}
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
