import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app lives in a subfolder alongside another project; pin the trace
  // root so Next.js doesn't walk up to the parent lockfile.
  outputFileTracingRoot: rootDir,
  eslint: {
    // Keep deploys resilient: lint is run explicitly via `npm run lint`,
    // not as a hard gate on the production build.
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
