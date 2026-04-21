"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarNav from "./SidebarNav";

type Props = {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userInitial: string;
  signOutAction: () => void | Promise<void>;
};

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":                  "Tableau de bord",
  "/dashboard/biens":            "Biens",
  "/dashboard/contrats":         "Contrats",
  "/dashboard/paiements":        "Paiements",
  "/dashboard/valider":          "À valider",
  "/dashboard/proprietaires":    "Propriétaires",
  "/dashboard/utilisateurs":     "Utilisateurs",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES)
    .filter(([key]) => key !== "/dashboard" && pathname.startsWith(key))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match?.[1] ?? "Dashboard";
}

export default function DashboardShell({
  children,
  userName,
  userEmail,
  userInitial,
  signOutAction,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Lock body scroll while mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200",
          "transition-transform duration-300 ease-in-out",
          // widths: mobile overlay=72(288px), tablet=72px, desktop=256px
          "w-72 md:w-[72px] lg:w-64",
          // transform: mobile controlled, tablet/desktop always visible
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
      >
        {/* X close — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Fermer le menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo / brand */}
        <div className="border-b border-gray-100 flex flex-col items-center py-4 px-4 lg:px-6 shrink-0">
          {/* Mobile open + Desktop: logo image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="AKIL IMMO"
            className="h-16 w-auto md:hidden lg:block"
          />
          <p className="text-xs uppercase tracking-wide text-gray-500 mt-1 text-center md:hidden lg:block">
            Administration
          </p>
          {/* Tablet: avatar "A" */}
          <div className="hidden md:flex lg:hidden h-10 w-10 items-center justify-center rounded-full bg-[#0066CC]/10">
            <span className="text-[#0066CC] font-bold text-lg">A</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2 lg:px-3">
          <SidebarNav onClose={() => setSidebarOpen(false)} />
        </div>

        {/* User info + sign-out */}
        <div className="border-t border-gray-100 p-3 space-y-2 shrink-0">
          <div className="flex items-center gap-3 px-2 md:justify-center lg:justify-start">
            <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
              <span className="text-[#0066CC] font-semibold text-xs">{userInitial}</span>
            </div>
            <div className="min-w-0 md:hidden lg:block">
              <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium md:justify-center lg:justify-start"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="md:hidden lg:inline">Se déconnecter</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile sticky header ────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 md:hidden shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-slate-800 truncate">
          {pageTitle}
        </span>
        <div className="h-8 w-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
          <span className="text-[#0066CC] font-semibold text-xs">{userInitial}</span>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 ml-0 md:ml-[72px] lg:ml-64 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
