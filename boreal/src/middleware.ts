import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Localize everything except:
  // - API routes
  // - the French-only back-office (/admin) and public verification (/verify)
  // - Next.js internals and static files
  matcher: ["/((?!api|admin|verify|_next|_vercel|.*\\..*).*)"],
};
