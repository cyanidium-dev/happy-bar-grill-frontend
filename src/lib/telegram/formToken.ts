import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.TELEGRAM_FORM_SECRET ?? "";

/**
 * How long a token stays valid after a page render.
 *
 * `/contacts` and `/checkout` are ISR pages (revalidated on a timer, not on
 * every request), so a visitor can be served an HTML page that was
 * generated a while ago if the route hasn't been hit recently. The TTL
 * needs enough slack to cover that staleness window plus a slow checkout
 * flow, or real visitors would occasionally get a false "Forbidden".
 */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

/**
 * Mints a short-lived, signed token in a Server Component and hands it to
 * a client form. The `/api/telegram` route only accepts requests that
 * carry a token it can verify with the same (server-only) secret, which
 * means a request must originate from a page we actually rendered.
 */
export function createFormToken(): string {
  if (!SECRET) return "";

  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyFormToken(token: unknown): boolean {
  if (!SECRET || typeof token !== "string") return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() <= expiresAt;
}
