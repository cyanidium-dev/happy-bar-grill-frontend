import type { NextRequest } from "next/server";

/**
 * Client IP for rate-limiting.
 *
 * Prefer platform-set headers. For `x-forwarded-for`, use the rightmost hop:
 * trusted proxies typically *append* the socket peer, so the leftmost values
 * can be attacker-controlled. On Vercel the header is overwritten anyway;
 * rightmost still matches a single-IP value.
 */
export function getClientIp(request: NextRequest): string {
  const vercel = firstHop(request.headers.get("x-vercel-forwarded-for"));
  if (vercel) return vercel;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = lastHop(request.headers.get("x-forwarded-for"));
  if (forwarded) return forwarded;

  return "unknown";
}

function firstHop(header: string | null): string | null {
  if (!header) return null;
  const hop = header.split(",")[0]?.trim();
  return hop || null;
}

function lastHop(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(",");
  for (let i = parts.length - 1; i >= 0; i--) {
    const hop = parts[i]?.trim();
    if (hop) return hop;
  }
  return null;
}
