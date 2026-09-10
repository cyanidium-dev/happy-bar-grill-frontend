import "server-only";
import { MIN_ORDER_AMOUNT } from "@/constants/contacts";
import { routing, type Locale } from "@/i18n/routing";
import { applyPromoCode, type PromoError } from "@/lib/orders/promoCodes";
import { client } from "@/sanity/lib/client";
import { DISHES_BY_SLUGS_QUERY } from "@/sanity/lib/queries";
import type {
  AppliedPromo,
  CartItem,
  DeliveryType,
  OrderCustomer,
  OrderTimeMode,
  PaymentMethod,
} from "@/types/cart";
import { isAvailableTimeSlot } from "@/utils/orderTimeSlots";
import { isDeliveryAddress } from "@/utils/address";
import { cartLineId, parseCartLineId } from "@/utils/cartLine";
import { isPersonName } from "@/utils/personName";
import { isUaPhoneE164 } from "@/utils/phone";

export type OrderErrorCode =
  | "invalid"
  | "unavailable"
  | "minOrder"
  | PromoError;

export class OrderError extends Error {
  constructor(public readonly code: OrderErrorCode) {
    super(code);
    this.name = "OrderError";
  }
}

const MAX_LINES = 50;
const MAX_QUANTITY = 99;
const MAX_TOTAL_QUANTITY = 100;
const MAX_COMMENT = 500;
const MAX_ID = 160;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

type OrderDish = {
  slug: string;
  categorySlug: string | null;
  name: string;
  nameUk: string;
  price: number;
  weight: number | null;
  image: string | null;
};

export type ResolvedOrder = {
  customer: OrderCustomer;
  /** Localized lines for the confirmation screen. */
  items: CartItem[];
  /** Ukrainian names for the kitchen Telegram message. */
  telegramItems: CartItem[];
  /** Line total before any discount. */
  subtotal: number;
  /** Verified discount, when a valid promo code was supplied. */
  promo?: AppliedPromo;
  /** Payable amount — `subtotal` minus the promo discount. */
  total: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) return null;
  return value as Record<string, unknown>;
}

function parseLocale(value: unknown): Locale {
  if (
    typeof value === "string" &&
    (routing.locales as readonly string[]).includes(value)
  ) {
    return value as Locale;
  }
  return routing.defaultLocale;
}

function parseLines(
  raw: unknown,
): {
  id: string;
  categorySlug: string | null;
  slug: string;
  quantity: number;
}[] {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) {
    throw new OrderError("invalid");
  }

  const merged = new Map<
    string,
    { categorySlug: string | null; slug: string; quantity: number }
  >();
  const order: string[] = [];

  for (const entry of raw) {
    const item = asRecord(entry);
    if (!item) throw new OrderError("invalid");

    const rawId = typeof item.id === "string" ? item.id.trim() : "";
    if (!rawId || rawId.length > MAX_ID) throw new OrderError("invalid");

    const parsed = parseCartLineId(rawId);
    const slug = parsed.slug;
    const categorySlug = parsed.categorySlug;
    if (!SLUG_RE.test(slug)) throw new OrderError("invalid");
    if (categorySlug && !SLUG_RE.test(categorySlug)) {
      throw new OrderError("invalid");
    }

    const key = categorySlug ? cartLineId(categorySlug, slug) : slug;

    const quantity = item.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      throw new OrderError("invalid");
    }

    const next = (merged.get(key)?.quantity ?? 0) + quantity;
    if (next > MAX_QUANTITY) throw new OrderError("invalid");
    if (!merged.has(key)) order.push(key);
    merged.set(key, { categorySlug, slug, quantity: next });
  }

  const totalQuantity = [...merged.values()].reduce(
    (sum, line) => sum + line.quantity,
    0,
  );
  if (totalQuantity > MAX_TOTAL_QUANTITY) throw new OrderError("invalid");

  return order.map((id) => {
    const line = merged.get(id)!;
    return { id, ...line };
  });
}

function parseBoundedString(
  value: unknown,
  min: number,
  max: number,
): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) return null;
  return trimmed;
}

function parseCustomer(raw: unknown): OrderCustomer {
  const data = asRecord(raw);
  if (!data) throw new OrderError("invalid");

  const rawName = typeof data.name === "string" ? data.name : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  if (!isPersonName(rawName) || !isUaPhoneE164(phone)) {
    throw new OrderError("invalid");
  }
  const name = rawName.trim();

  const deliveryType = data.deliveryType;
  if (deliveryType !== "delivery" && deliveryType !== "pickup") {
    throw new OrderError("invalid");
  }
  const typedDelivery = deliveryType as DeliveryType;

  const payment = data.payment;
  if (payment !== "cash" && payment !== "card") {
    throw new OrderError("invalid");
  }

  let address: string | undefined;
  if (typedDelivery === "delivery") {
    const rawAddress = typeof data.address === "string" ? data.address : "";
    if (!isDeliveryAddress(rawAddress)) throw new OrderError("invalid");
    address = rawAddress.trim();
  }

  let timeMode: OrderTimeMode = "asap";
  let scheduledAt: string | undefined;
  if (typedDelivery === "pickup") {
    if (data.timeMode !== "asap" && data.timeMode !== "scheduled") {
      throw new OrderError("invalid");
    }
    timeMode = data.timeMode;
    if (timeMode === "scheduled") {
      if (
        typeof data.scheduledAt !== "string" ||
        !isAvailableTimeSlot("pickup", data.scheduledAt)
      ) {
        throw new OrderError("invalid");
      }
      scheduledAt = data.scheduledAt;
    }
  }

  let comment: string | undefined;
  if (
    data.comment !== undefined &&
    data.comment !== null &&
    data.comment !== ""
  ) {
    const parsed = parseBoundedString(data.comment, 1, MAX_COMMENT);
    if (!parsed) throw new OrderError("invalid");
    comment = parsed;
  }

  return {
    name,
    phone,
    deliveryType: typedDelivery,
    address,
    timeMode,
    scheduledAt,
    payment: payment as PaymentMethod,
    comment,
  };
}

function toCartItem(dish: OrderDish, quantity: number, name: string): CartItem {
  const categorySlug = dish.categorySlug || undefined;
  const id = categorySlug ? cartLineId(categorySlug, dish.slug) : dish.slug;
  return {
    id,
    slug: dish.slug,
    categorySlug,
    name,
    price: dish.price,
    image: dish.image ?? "",
    imageAlt: name,
    weight: dish.weight ?? undefined,
    quantity,
  };
}

function matchDish(
  dishes: OrderDish[],
  line: { categorySlug: string | null; slug: string },
): OrderDish | undefined {
  if (line.categorySlug) {
    return dishes.find(
      (dish) =>
        dish.slug === line.slug && dish.categorySlug === line.categorySlug,
    );
  }
  const matches = dishes.filter((dish) => dish.slug === line.slug);
  return matches.length === 1 ? matches[0] : undefined;
}

export type ResolvedLines = {
  items: CartItem[];
  telegramItems: CartItem[];
  /** Line total from live Sanity prices, before any discount. */
  subtotal: number;
};

/**
 * Prices a basket of client-supplied ids/quantities against live Sanity
 * documents. Shared by order placement and the promo-code preview, so a
 * discount is always quoted against the same numbers the order will use —
 * a preview that disagreed with checkout would be worse than no preview.
 */
export async function resolveCartLines(
  rawItems: unknown,
  rawLocale: unknown,
): Promise<ResolvedLines> {
  const lines = parseLines(rawItems);
  const locale = parseLocale(rawLocale);
  const slugs = [...new Set(lines.map((line) => line.slug))];

  const dishes = await client.fetch<OrderDish[]>(
    DISHES_BY_SLUGS_QUERY,
    { slugs, locale },
    { next: { revalidate: 0 } },
  );

  const items: CartItem[] = [];
  const telegramItems: CartItem[] = [];

  for (const line of lines) {
    const dish = matchDish(dishes, line);
    if (
      !dish ||
      typeof dish.price !== "number" ||
      !Number.isFinite(dish.price) ||
      dish.price < 0 ||
      typeof dish.name !== "string" ||
      !dish.name.trim()
    ) {
      throw new OrderError("unavailable");
    }

    const displayName = dish.name.trim();
    const telegramName =
      typeof dish.nameUk === "string" && dish.nameUk.trim()
        ? dish.nameUk.trim()
        : displayName;

    items.push(toCartItem(dish, line.quantity, displayName));
    telegramItems.push(toCartItem(dish, line.quantity, telegramName));
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { items, telegramItems, subtotal };
}

/**
 * Builds an order from client-supplied ids/quantities and customer fields.
 * Prices, names and availability always come from live Sanity documents.
 */
export async function resolveOrder(body: unknown): Promise<ResolvedOrder> {
  const data = asRecord(body);
  if (!data) throw new OrderError("invalid");

  const customer = parseCustomer(data.customer);
  const { items, telegramItems, subtotal } = await resolveCartLines(
    data.items,
    data.locale,
  );

  /**
   * The minimum basket is checked against the *pre-discount* subtotal. Testing
   * the discounted total instead would let any promo code walk an order under
   * the delivery minimum, which is the one thing the minimum exists to prevent.
   */
  if (customer.deliveryType === "delivery" && subtotal < MIN_ORDER_AMOUNT) {
    throw new OrderError("minOrder");
  }

  let promo: AppliedPromo | undefined;
  if (data.promoCode !== undefined && data.promoCode !== null && data.promoCode !== "") {
    const result = applyPromoCode(
      data.promoCode,
      subtotal,
      customer.deliveryType,
    );
    // A bad code fails the order rather than being silently dropped: the
    // customer saw a discounted total on the checkout screen and must not be
    // charged the full amount without being told.
    if (!result.ok) throw new OrderError(result.error);
    promo = result.promo;
  }

  const total = subtotal - (promo?.amount ?? 0);

  return { customer, items, telegramItems, subtotal, promo, total };
}
