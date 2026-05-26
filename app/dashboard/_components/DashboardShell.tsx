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
  "/dashboard":                "Tableau de bord",
  "/dashboard/biens":          "Biens",
  "/dashboard/contrats":       "Contrats",
  "/dashboard/paiements":      "Paiements",
  "/dashboard/valider":        "Biens à valider",
  "/dashboard/reservations":   "Réservations",
  "/dashboard/proprietaires":  "Propriétaires",
  "/dashboard/utilisateurs":   "Utilisateurs",
  "/dashboard/demandes":       "Demandes docs",
  "/dashboard/messages":       "Messages",
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

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(28,25,23,0.6)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "w-72 md:w-[72px] lg:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
        style={{ backgroundColor: "#1C1917", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* X close — mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 md:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-label="Fermer le menu"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Brand */}
        <div
          className="flex flex-col items-center py-5 px-4 lg:px-6 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Desktop + mobile open */}
          <div className="md:hidden lg:flex flex-col items-center gap-1">
            <div
              className="rounded-xl px-3 py-2 flex items-center justify-center"
              style={{ backgroundColor: "rgba(200,146,42,0.15)", border: "1px solid rgba(200,146,42,0.3)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="AKIL IMMO" className="h-9 w-auto" />
            </div>
            <p
              className="text-xs uppercase tracking-widest mt-1"
              style={{ color: "#C8922A", fontWeight: 600, letterSpacing: "0.14em", fontSize: "0.6rem" }}
            >
              Administration
            </p>
          </div>
          {/* Tablet icon */}
          <div
            className="hidden md:flex lg:hidden h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(200,146,42,0.15)", border: "1px solid rgba(200,146,42,0.3)" }}
          >
            <span style={{ color: "#C8922A", fontWeight: 700, fontSize: "1rem" }}>A</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2 lg:px-3">
          <SidebarNav onClose={() => setSidebarOpen(false)} />
        </div>

        {/* User + sign-out */}
        <div
          className="p-3 space-y-2 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 px-2 md:justify-center lg:justify-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(200,146,42,0.2)", border: "1px solid rgba(200,146,42,0.35)" }}
            >
              <span style={{ color: "#C8922A", fontWeight: 700, fontSize: "0.7rem" }}>{userInitial}</span>
            </div>
            <div className="min-w-0 md:hidden lg:block">
              <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{userName}</p>
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{userEmail}</p>
            </div>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors font-medium md:justify-center lg:justify-start"
              style={{ color: "rgba(239,68,68,0.8)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "rgb(239,68,68)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(239,68,68,0.8)";
              }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="md:hidden lg:inline">Se déconnecter</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile sticky header */}
      <header
        className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 gap-3 md:hidden"
        style={{ backgroundColor: "#1C1917", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
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
        <span className="flex-1 text-center text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.9)" }}>
          {pageTitle}
        </span>
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(200,146,42,0.2)", border: "1px solid rgba(200,146,42,0.35)" }}
        >
          <span style={{ color: "#C8922A", fontWeight: 700, fontSize: "0.7rem" }}>{userInitial}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-[72px] lg:ml-64 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
