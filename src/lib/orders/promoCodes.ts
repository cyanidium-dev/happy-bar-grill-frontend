import "server-only";
import type { AppliedPromo, DeliveryType } from "@/types/cart";

/**
 * Promo codes.
 *
 * Server-only on purpose: a code's value, its rules and the resulting discount
 * are never sent to the browser except as the single verified number attached
 * to an order. The checkout screen can *preview* a discount via `/api/promo`,
 * but `resolveOrder` recomputes it from scratch before the order is accepted,
 * so a tampered client can only ever lie to itself.
 */

export type PromoRule = {
  /** Compared case-insensitively; stored upper-case. */
  code: string;
  /** `percent` takes `value`% off the subtotal; `fixed` takes `value` off. */
  kind: "percent" | "fixed";
  value: number;
  /** Minimum line subtotal (before discount) the code applies to. */
  minSubtotal?: number;
  /** Upper bound for a percentage discount, in currency units. */
  maxDiscount?: number;
  /** Restricts the code to one fulfilment type. */
  deliveryType?: DeliveryType;
  /** ISO date (inclusive) the campaign opens / closes. */
  startsAt?: string;
  endsAt?: string;
};

/**
 * Built-in campaigns. Edit here for anything long-lived; use the
 * `ORDER_PROMO_CODES` env var for short campaigns you want to start and stop
 * without a deploy (it replaces this list entirely when set).
 */
const BUILT_IN: PromoRule[] = [
  // −10% on any delivery order over the minimum basket.
  { code: "VTIHA10", kind: "percent", value: 10, minSubtotal: 300, maxDiscount: 300 },
  // Flat 50 off, pickup only — nudges walk-ins.
  { code: "SAMOVYVIZ", kind: "fixed", value: 50, minSubtotal: 250, deliveryType: "pickup" },
];

export type PromoError =
  | "unknownPromo"
  | "expiredPromo"
  | "promoMinOrder"
  | "promoDeliveryType";

const MAX_CODE_LENGTH = 32;
const CODE_RE = /^[A-Z0-9][A-Z0-9_-]{1,31}$/;

/** Normalizes user input to the stored form; `null` if it can't be a code. */
export function normalizePromoCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  if (!code || code.length > MAX_CODE_LENGTH) return null;
  return CODE_RE.test(code) ? code : null;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

/**
 * Parses `ORDER_PROMO_CODES`, a JSON array of `PromoRule`. Anything malformed
 * is dropped with a warning rather than throwing — a typo in an env var must
 * not take checkout down, it should just mean "that code doesn't work".
 */
function parseEnvRules(raw: string): PromoRule[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[promo] ORDER_PROMO_CODES is not valid JSON — ignoring it");
    return [];
  }
  if (!Array.isArray(parsed)) {
    console.warn("[promo] ORDER_PROMO_CODES must be a JSON array — ignoring it");
    return [];
  }

  return parsed.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const rule = entry as Record<string, unknown>;

    const code = normalizePromoCode(rule.code);
    const kind = rule.kind;
    const value = rule.value;
    if (
      !code ||
      (kind !== "percent" && kind !== "fixed") ||
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0 ||
      (kind === "percent" && value > 100)
    ) {
      console.warn(`[promo] skipping malformed rule: ${JSON.stringify(entry)}`);
      return [];
    }

    const numberOrUndefined = (input: unknown) =>
      typeof input === "number" && Number.isFinite(input) && input >= 0
        ? input
        : undefined;

    return [
      {
        code,
        kind,
        value,
        minSubtotal: numberOrUndefined(rule.minSubtotal),
        maxDiscount: numberOrUndefined(rule.maxDiscount),
        deliveryType:
          rule.deliveryType === "delivery" || rule.deliveryType === "pickup"
            ? rule.deliveryType
            : undefined,
        startsAt: isIsoDate(rule.startsAt) ? rule.startsAt : undefined,
        endsAt: isIsoDate(rule.endsAt) ? rule.endsAt : undefined,
      },
    ];
  });
}

let cachedRules: PromoRule[] | null = null;

function rules(): PromoRule[] {
  if (cachedRules) return cachedRules;
  const raw = process.env.ORDER_PROMO_CODES?.trim();
  cachedRules = raw ? parseEnvRules(raw) : BUILT_IN;
  return cachedRules;
}

function isLive(rule: PromoRule, now: number): boolean {
  if (rule.startsAt && now < Date.parse(rule.startsAt)) return false;
  // `endsAt` is an inclusive day: a code ending "2026-09-30" works all of the
  // 30th, which is what a campaign brief always means.
  if (rule.endsAt) {
    const end = Date.parse(rule.endsAt);
    const endOfDay = end + (rule.endsAt.length <= 10 ? 24 * 60 * 60 * 1000 - 1 : 0);
    if (now > endOfDay) return false;
  }
  return true;
}

export type PromoResult =
  | { ok: true; promo: AppliedPromo }
  | { ok: false; error: PromoError };

/**
 * Resolves a code against a concrete basket. The discount is rounded down to
 * whole currency units and can never exceed the subtotal, so an order total is
 * always a non-negative integer.
 */
export function applyPromoCode(
  rawCode: unknown,
  subtotal: number,
  deliveryType: DeliveryType,
  now: number = Date.now(),
): PromoResult {
  const code = normalizePromoCode(rawCode);
  if (!code) return { ok: false, error: "unknownPromo" };

  const rule = rules().find((it) => it.code === code);
  if (!rule) return { ok: false, error: "unknownPromo" };
  if (!isLive(rule, now)) return { ok: false, error: "expiredPromo" };
  if (rule.deliveryType && rule.deliveryType !== deliveryType) {
    return { ok: false, error: "promoDeliveryType" };
  }
  if (rule.minSubtotal !== undefined && subtotal < rule.minSubtotal) {
    return { ok: false, error: "promoMinOrder" };
  }

  const raw =
    rule.kind === "percent" ? (subtotal * rule.value) / 100 : rule.value;
  const capped =
    rule.maxDiscount !== undefined ? Math.min(raw, rule.maxDiscount) : raw;
  const amount = Math.min(subtotal, Math.floor(capped));

  // A code that resolves to nothing (tiny basket, aggressive cap) is more
  // honestly reported as "doesn't apply" than as a 0 discount.
  if (amount <= 0) return { ok: false, error: "promoMinOrder" };

  return { ok: true, promo: { code, amount } };
}

/** Minimum basket a code needs, for the checkout hint. */
export function promoMinSubtotal(rawCode: unknown): number | null {
  const code = normalizePromoCode(rawCode);
  if (!code) return null;
  return rules().find((it) => it.code === code)?.minSubtotal ?? null;
}
