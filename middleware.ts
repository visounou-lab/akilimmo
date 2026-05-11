import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const CUID_RE = /^c[a-z0-9]{24}$/;

const PROTECTED_PREFIXES = ["/dashboard", "/owner", "/tenant"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect old CUID-based bien URLs to slug-based URLs
  const match = pathname.match(/^\/biens\/([^/]+)$/);
  if (match) {
    const segment = match[1];
    if (CUID_RE.test(segment)) {
      const url = req.nextUrl.clone();
      url.pathname = "/api/resolve-bien";
      url.searchParams.set("id", segment);
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Edge protection for authenticated routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected) {
    const secureCookie = req.nextUrl.protocol === "https:";
    const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie });
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/biens/:path*", "/dashboard/:path*", "/owner/:path*", "/tenant/:path*"],
};
