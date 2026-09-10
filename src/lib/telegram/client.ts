import { API_TIMEOUT_MS } from "@/lib/http/timeout";
import type {
  AppliedPromo,
  CartItem,
  OrderCustomer,
  OrderLineRequest,
} from "@/types/cart";

/** Error codes the checkout screen knows how to explain to the customer. */
export const ORDER_ERROR_CODES = [
  "unavailable",
  "minOrder",
  "unknownPromo",
  "expiredPromo",
  "promoMinOrder",
  "promoDeliveryType",
  "submit",
] as const;

export type OrderErrorCode = (typeof ORDER_ERROR_CODES)[number];

function toOrderErrorCode(value: unknown): OrderErrorCode {
  return (ORDER_ERROR_CODES as readonly string[]).includes(value as string)
    ? (value as OrderErrorCode)
    : "submit";
}

export class OrderRequestError extends Error {
  constructor(public readonly code: OrderErrorCode) {
    super(code);
    this.name = "OrderRequestError";
  }
}

export type PlacedOrderResponse = {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  promo?: AppliedPromo;
  total: number;
};

export type PromoPreview =
  | { ok: true; code: string; amount: number; subtotal: number; total: number }
  | { ok: false; error: OrderErrorCode };

/**
 * Asks the server what a promo code is worth for the current basket.
 * Purely advisory — the order endpoint recomputes the discount — so a network
 * failure here surfaces as "couldn't check", never as a silent full-price
 * order.
 */
export async function checkPromoCode(
  formToken: string,
  locale: string,
  code: string,
  items: OrderLineRequest[],
  deliveryType: "delivery" | "pickup",
): Promise<PromoPreview> {
  const res = await fetch("/api/promo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: formToken,
      locale,
      code,
      items,
      deliveryType,
    }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  const payload = (await res.json().catch(() => null)) as
    | (Partial<PromoPreview> & { error?: string })
    | null;

  if (!res.ok || !payload) {
    throw new OrderRequestError("submit");
  }
  if (payload.ok === true) {
    return payload as Extract<PromoPreview, { ok: true }>;
  }
  return { ok: false, error: toOrderErrorCode(payload.error) };
}

export async function sendContactMessage(
  name: string,
  phone: string,
  message: string,
  formToken: string,
): Promise<void> {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message, token: formToken }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error("Failed to send telegram message");
  }
}

export async function submitOrder(
  formToken: string,
  locale: string,
  customer: OrderCustomer,
  items: OrderLineRequest[],
  idempotencyKey: string,
  promoCode?: string,
): Promise<PlacedOrderResponse> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: formToken,
      locale,
      customer,
      items,
      idempotencyKey,
      promoCode: promoCode || undefined,
    }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new OrderRequestError(toOrderErrorCode(payload?.error));
  }

  return res.json() as Promise<PlacedOrderResponse>;
}
