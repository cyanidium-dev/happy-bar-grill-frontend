import type { NextRequest } from "next/server";

/**
 * Best-effort client IP behind a reverse proxy (Vercel / nginx).
 * Falls back to `"unknown"` so missing headers still share one rate-limit bucket.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}
