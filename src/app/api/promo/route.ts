import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/http/clientIp";
import { rateLimit } from "@/lib/http/rateLimit";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
import { applyPromoCode } from "@/lib/orders/promoCodes";
import { OrderError, resolveCartLines } from "@/lib/orders/resolveOrder";
import { verifyFormToken } from "@/lib/telegram/formToken";

/**
 * Promo-code preview for the checkout screen.
 *
 * This endpoint is advisory: it tells the customer what a code is worth before
 * they commit. `/api/orders` recomputes the discount from scratch when the
 * order is actually placed, so nothing here is load-bearing for pricing — but
 * the basket is still priced from Sanity rather than trusted from the request,
 * so the previewed number and the charged number always agree.
 *
 * Rate limited harder than order placement because an unauthenticated
 * validator is exactly the shape of thing people brute-force for valid codes.
 */
const RATE = { limit: 12, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = rateLimit(`promo:${getClientIp(request)}`, RATE);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = (await request.json()) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    if (!verifyFormToken(body.token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deliveryType = body.deliveryType;
    if (deliveryType !== "delivery" && deliveryType !== "pickup") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const { subtotal } = await resolveCartLines(body.items, body.locale);
    const result = applyPromoCode(body.code, subtotal, deliveryType);

    if (!result.ok) {
      // 200, not 4xx: "this code doesn't apply to your basket" is a normal
      // answer to a valid question, and the client renders it as a hint.
      return NextResponse.json({ ok: false, error: result.error });
    }

    return NextResponse.json({
      ok: true,
      code: result.promo.code,
      amount: result.promo.amount,
      subtotal,
      total: subtotal - result.promo.amount,
    });
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.code }, { status: 400 });
    }
    console.error("[promo] unexpected error:", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
