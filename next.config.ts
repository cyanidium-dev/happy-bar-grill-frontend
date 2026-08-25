import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.88.31"],
  images: {
    // Keep this list small and stable — a corrupted/growing qualities array
    // floods the terminal and inflates memory during Turbopack HMR.
    qualities: [75, 90],
    // Drop the default 3840 slot: with `sizes="100vw"` a 2x desktop still
    // requests 4K, and a missing/loose `sizes` sends that even to phones.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // No Sanity/Unsplash in remotePatterns: CMS photography renders through
    // `SanityImage` (plain `<img>` + those CDNs' own resize APIs), never
    // through `/_next/image`. Remaining `next/image` usage is local/static
    // assets in `public/`, which keep Vercel's optimization pipeline.
    remotePatterns: [],
  },
  // Avoid app/sitemap.xml and app/robots.txt folders — they collide with
  // Next.js metadata conventions and break Turbopack (handler is not a function).
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap" },
      { source: "/robots.txt", destination: "/api/robots" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: "<https://cdn.sanity.io>; rel=preconnect; crossorigin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
