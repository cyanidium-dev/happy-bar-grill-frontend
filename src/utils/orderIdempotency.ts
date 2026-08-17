const STORAGE_KEY = "vtiha-order-idempotency";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Stored = { key: string; fp: string };

/**
 * Reuses the same key across retries of one checkout intent (same payload).
 * A changed form after a failed submit gets a new key.
 */
export function ensureOrderIdempotencyKey(fingerprint: string): string {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      if (
        parsed.fp === fingerprint &&
        typeof parsed.key === "string" &&
        UUID_RE.test(parsed.key)
      ) {
        return parsed.key;
      }
    }
    const key = crypto.randomUUID();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ key, fp: fingerprint } satisfies Stored),
    );
    return key;
  } catch {
    return crypto.randomUUID();
  }
}

export function clearOrderIdempotencyKey(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // private mode / blocked storage
  }
}
