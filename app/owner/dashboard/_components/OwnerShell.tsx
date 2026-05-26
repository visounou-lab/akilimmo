"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import OwnerSidebarNav from "./OwnerSidebarNav";

type Props = {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userInitial: string;
  unreadCount: number;
  signOutAction: () => void | Promise<void>;
};

const PAGE_TITLES: Record<string, string> = {
  "/owner/dashboard":               "Tableau de bord",
  "/owner/dashboard/biens":         "Mes biens",
  "/owner/dashboard/soumettre":     "Soumettre un bien",
  "/owner/dashboard/demandes":      "Mes demandes",
  "/owner/dashboard/profil":        "Mon profil",
  "/owner/dashboard/notifications": "Notifications",
  "/owner/dashboard/paiements":     "Mes paiements",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES)
    .filter(([key]) => key !== "/owner/dashboard" && pathname.startsWith(key))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match?.[1] ?? "Mon espace";
}

export default function OwnerShell({
  children,
  userName,
  userEmail,
  userInitial,
  unreadCount,
  signOutAction,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FDFCF8" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(28,25,23,0.7)", backdropFilter: "blur(2px)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
        style={{ backgroundColor: "#1C1917", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Brand */}
        <div
          className="relative px-5 py-5 shrink-0 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center justify-center rounded-xl px-2.5 py-1.5"
            style={{ backgroundColor: "rgba(200,146,42,0.15)", border: "1px solid rgba(200,146,42,0.25)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AKIL IMMO" className="h-8 w-auto" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight tracking-wide">AKIL IMMO</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter), sans-serif" }}>
              Espace propriétaire
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 lg:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            aria-label="Fermer le menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <OwnerSidebarNav onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
        </div>

        {/* User footer */}
        <div className="shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(200,146,42,0.2)", border: "1px solid rgba(200,146,42,0.35)" }}
            >
              <span className="font-semibold text-xs" style={{ color: "#C8922A" }}>{userInitial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{userEmail}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium group"
              style={{ color: "rgba(248,113,113,0.85)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Se déconnecter</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3 lg:hidden"
        style={{ backgroundColor: "#1C1917", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors shrink-0"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="flex-1 text-center text-sm font-semibold text-white truncate">
          {pageTitle}
        </span>

        <Link
          href="/owner/dashboard/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors shrink-0"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
