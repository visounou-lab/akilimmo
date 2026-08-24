"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, User, LogOut, LayoutDashboard } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";

const NAV_LINKS = [
  { label: "Louer",    href: "/biens" },
  { label: "Terrains", href: "/terrains" },
  { label: "Voitures", href: "/voitures" },
  { label: "Séjours",  href: "/sejours" },
  { label: "Journal",  href: "/blog" },
];

type SessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string;
  requestedRole?: string;
};

/** Renvoie le tableau de bord adapté au profil (même logique que la page de connexion). */
function dashboardPath(user: SessionUser): string {
  if (user.role === "ADMIN") return "/dashboard";
  if (user.requestedRole === "OWNER" || user.requestedRole === "AGENT") return "/verification";
  if (user.role === "AGENT") return "/agent/dashboard";
  if (user.role === "OWNER") return "/owner/dashboard";
  return "/tenant/dashboard";
}

/** Libellé lisible du profil, pour afficher « Espace propriétaire » etc. */
function roleLabel(user: SessionUser): string {
  if (user.requestedRole === "OWNER" || user.requestedRole === "AGENT") return "Vérification en cours";
  switch (user.role) {
    case "ADMIN":  return "Administration";
    case "AGENT":  return "Espace agent";
    case "OWNER":  return "Espace propriétaire";
    default:        return "Espace locataire";
  }
}

function initials(user: SessionUser): string {
  const src = (user.name || user.email || "").trim();
  if (!src) return "?";
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as SessionUser | undefined;
  const isAuthed = status === "authenticated" && !!user;
  const isLoading = status === "loading";

  // Ferme le menu compte au clic extérieur / touche Échap.
  useEffect(() => {
    if (!accountOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAccountOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  function isActive(href: string) {
    if (href.startsWith("#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const ring =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#1C1917", borderBottom: "1px solid rgba(200,146,42,0.2)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className={`flex items-center gap-3 cursor-pointer shrink-0 ${ring}`}
            aria-label="AKIL IMMO — Accueil"
          >
            <BrandLogo height={32} theme="dark" />
          </a>

          {/* Desktop nav — liens services */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm cursor-pointer transition-colors duration-200 ${ring}`}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: active ? 500 : 400,
                    color: active ? "#C8922A" : "rgba(253,252,248,0.72)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active ? "#C8922A" : "rgba(253,252,248,0.72)")
                  }
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* CTA desktop — s'adapte au profil */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Lien discret "Comment ça marche" */}
            <a
              href="/comment-ca-marche"
              className={`text-xs cursor-pointer px-3 py-2 transition-colors duration-150 ${ring}`}
              style={{ fontFamily: "var(--font-inter), sans-serif", color: "rgba(253,252,248,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(253,252,248,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,252,248,0.5)")}
            >
              Comment ça marche
            </a>

            {/* Zone compte : réservée pendant le chargement pour éviter le saut de mise en page */}
            {isLoading ? (
              <div style={{ width: 240, height: 36 }} aria-hidden="true" />
            ) : isAuthed && user ? (
              /* --- CONNECTÉ : bouton "Mon espace" + menu déroulant --- */
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className={`flex items-center gap-2 cursor-pointer rounded-lg py-1.5 pl-1.5 pr-3 text-sm transition-colors duration-150 ${ring}`}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    border: "1px solid rgba(200,146,42,0.35)",
                    color: "#FDFCF8",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.10)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span
                    className="flex items-center justify-center rounded-full text-xs font-semibold"
                    style={{ width: 26, height: 26, backgroundColor: "#C8922A", color: "#1C1917" }}
                    aria-hidden="true"
                  >
                    {initials(user)}
                  </span>
                  <span className="max-w-[9rem] truncate" style={{ fontWeight: 500 }}>
                    {user.name || "Mon espace"}
                  </span>
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg shadow-xl"
                    style={{
                      backgroundColor: "#26211D",
                      border: "1px solid rgba(200,146,42,0.25)",
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(200,146,42,0.15)" }}>
                      <p className="truncate text-sm" style={{ color: "#FDFCF8", fontWeight: 500 }}>
                        {user.name || user.email}
                      </p>
                      <p className="truncate text-xs" style={{ color: "#C8922A" }}>
                        {roleLabel(user)}
                      </p>
                    </div>
                    <a
                      href={dashboardPath(user)}
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors"
                      style={{ color: "#FDFCF8", fontFamily: "var(--font-inter), sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.10)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <LayoutDashboard size={16} aria-hidden="true" />
                      Mon espace
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors"
                      style={{ color: "rgba(253,252,248,0.75)", fontFamily: "var(--font-inter), sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <LogOut size={16} aria-hidden="true" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- NON CONNECTÉ : "Se connecter" + "Devenir propriétaire" --- */
              <>
                <a
                  href="/login"
                  className={`flex items-center gap-1.5 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${ring}`}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                    border: "1px solid rgba(200,146,42,0.4)",
                    color: "#FDFCF8",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <User size={14} aria-hidden="true" />
                  Se connecter
                </a>
                <a
                  href="/inscription"
                  className={`flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]`}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 600,
                    backgroundColor: "#C8922A",
                    color: "#ffffff",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#A97620";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#C8922A";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Home size={13} aria-hidden="true" />
                  Devenir propriétaire
                </a>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="md:hidden min-h-11 min-w-11 cursor-pointer rounded-md p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
            style={{ color: "#FDFCF8" }}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 pb-5 pt-2"
          style={{ backgroundColor: "#1C1917", borderColor: "rgba(200,146,42,0.25)" }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className="block py-2.5 text-sm cursor-pointer transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#C8922A" : "rgba(253,252,248,0.8)",
                }}
              >
                {link.label}
              </a>
            );
          })}

          {/* Séparateur */}
          <div
            className="my-3"
            style={{ height: 1, backgroundColor: "rgba(200,146,42,0.15)" }}
            aria-hidden="true"
          />

          <a
            href="/comment-ca-marche"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-sm cursor-pointer"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "rgba(253,252,248,0.6)" }}
          >
            Comment ça marche
          </a>

          {/* Zone compte — mobile */}
          {isAuthed && user ? (
            <>
              <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5"
                   style={{ backgroundColor: "rgba(200,146,42,0.08)" }}>
                <span
                  className="flex items-center justify-center rounded-full text-xs font-semibold"
                  style={{ width: 32, height: 32, backgroundColor: "#C8922A", color: "#1C1917" }}
                  aria-hidden="true"
                >
                  {initials(user)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm" style={{ color: "#FDFCF8", fontWeight: 500 }}>
                    {user.name || user.email}
                  </p>
                  <p className="truncate text-xs" style={{ color: "#C8922A" }}>{roleLabel(user)}</p>
                </div>
              </div>
              <a
                href={dashboardPath(user)}
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold"
                style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C8922A", color: "#1C1917" }}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                Mon espace
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="mt-2 flex w-full items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-3 text-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  border: "1px solid rgba(253,252,248,0.2)",
                  color: "rgba(253,252,248,0.85)",
                }}
              >
                <LogOut size={16} aria-hidden="true" />
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  border: "1px solid rgba(200,146,42,0.4)",
                  color: "#FDFCF8",
                }}
              >
                <User size={16} aria-hidden="true" />
                Se connecter
              </a>
              <a
                href="/inscription"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 justify-center cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold"
                style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C8922A", color: "#ffffff" }}
              >
                <Home size={14} aria-hidden="true" />
                Devenir propriétaire
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
