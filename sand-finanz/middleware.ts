import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

// Paths reachable while only the password step is done (mfa_pending) or logged out.
const PUBLIC_ADMIN = ["/admin/login", "/admin/mfa"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const isPublic = PUBLIC_ADMIN.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (session?.stage === "authenticated") {
    // Already in — keep them out of the login/mfa screens.
    if (isPublic) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (session?.stage === "mfa_pending") {
    // Password done, second factor pending: only the MFA screens are allowed.
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/mfa", req.url));
  }

  // Not authenticated at all.
  if (pathname === "/admin/login") return NextResponse.next();
  const url = new URL("/admin/login", req.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
