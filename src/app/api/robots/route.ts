import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SITE_ALLOW_INDEXING } from "@/lib/seo/constants";

const NOINDEX_PATHS = [
  "/checkout",
  "/confirmation",
  "/privacy",
  "/offer",
  "/ru/checkout",
  "/ru/confirmation",
  "/ru/privacy",
  "/ru/offer",
];

export async function GET() {
  const headersList = await headers();
  const host = headersList.get("host") || headersList.get("x-forwarded-host");
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  let baseUrl = SITE_URL;

  if (!baseUrl) {
    if (host) {
      const protocol =
        headersList.get("x-forwarded-proto") ||
        (process.env.NODE_ENV === "production" ? "https" : "http");
      baseUrl = `${protocol}://${host}`;
    } else {
      baseUrl = "https://happy-bar-grill.vercel.app";
    }
  }

  baseUrl = baseUrl.replace(/\/+$/, "");
  const hostName = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const robotsTxt = SITE_ALLOW_INDEXING
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /_next/image",
        ...NOINDEX_PATHS.map((path) => `Disallow: ${path}`),
        "",
        `Host: ${hostName}`,
        `Sitemap: ${baseUrl}/sitemap.xml`,
        "",
      ].join("\n")
    : ["User-agent: *", "Disallow: /", ""].join("\n");

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}
