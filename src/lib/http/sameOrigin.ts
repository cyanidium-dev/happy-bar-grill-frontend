import type { NextRequest } from "next/server";

/**
 * Mirrors the same-origin check Next.js applies to Server Actions: the
 * `Origin` header (sent by browsers on every same-origin POST, not just
 * cross-origin ones) must match the host the request was made to. This
 * rejects requests fired directly at the endpoint from another site or a
 * bare script that doesn't set an `Origin` header at all.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!requestHost) return false;

  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}
