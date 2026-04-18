import { NextRequest, NextResponse } from "next/server";

const CUID_RE = /^c[a-z0-9]{24}$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Match /biens/{segment} — exactly one segment after /biens/
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/biens/:path*"],
};
