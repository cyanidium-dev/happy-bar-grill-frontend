import "server-only";

type Bucket = {
  count: number;
  resetAt: number;
  /** Keys already charged in this window (e.g. order idempotency UUIDs). */
  seen: Set<string>;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

/**
 * Fixed-window in-memory rate limit. Fine for a single Node process; on
 * serverless / multi-instance each isolate has its own map, so this is a
 * soft brake against casual spam, not a hard distributed quota.
 *
 * Pass `dedupeKey` so retries that share the same business key (e.g. order
 * idempotency UUID) consume the quota only once per window.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  dedupeKey?: string,
): RateLimitResult {
  const now = Date.now();
  prune(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs, seen: new Set() };
    buckets.set(key, bucket);
  }

  if (dedupeKey && bucket.seen.has(dedupeKey)) {
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  if (dedupeKey) bucket.seen.add(dedupeKey);
  return { ok: true };
}

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
