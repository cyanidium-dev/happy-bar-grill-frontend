import "server-only";
import { routing, type Locale } from "@/i18n/routing";
import { client } from "@/sanity/lib/client";
import { DISHES_BY_SLUGS_QUERY } from "@/sanity/lib/queries";
import type {
  CartItem,
  DeliveryType,
  OrderCustomer,
  OrderTimeMode,
  PaymentMethod,
} from "@/types/cart";
import { isAvailableTimeSlot } from "@/utils/orderTimeSlots";

export class OrderError extends Error {
  constructor(public readonly code: "invalid" | "unavailable") {
    super(code);
    this.name = "OrderError";
  }
}

const MAX_LINES = 50;
const MAX_QUANTITY = 99;
const MAX_TOTAL_QUANTITY = 100;
const MAX_NAME = 80;
const MAX_ADDRESS = 200;
const MAX_COMMENT = 500;
const PHONE_RE = /^\+380\d{9}$/;
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

function parseLines(raw: unknown): { id: string; quantity: number }[] {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) {
    throw new OrderError("invalid");
  }

  const merged = new Map<string, number>();
  const order: string[] = [];

  for (const entry of raw) {
    const item = asRecord(entry);
    if (!item) throw new OrderError("invalid");

    const id = typeof item.id === "string" ? item.id.trim() : "";
    if (!id || id.length > 80 || !SLUG_RE.test(id)) {
      throw new OrderError("invalid");
    }

    const quantity = item.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      throw new OrderError("invalid");
    }

    const next = (merged.get(id) ?? 0) + quantity;
    if (next > MAX_QUANTITY) throw new OrderError("invalid");
    if (!merged.has(id)) order.push(id);
    merged.set(id, next);
  }

  const totalQuantity = [...merged.values()].reduce((sum, n) => sum + n, 0);
  if (totalQuantity > MAX_TOTAL_QUANTITY) throw new OrderError("invalid");

  return order.map((id) => ({ id, quantity: merged.get(id)! }));
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

  const name = parseBoundedString(data.name, 2, MAX_NAME);
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  if (!name || !PHONE_RE.test(phone)) throw new OrderError("invalid");

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
    const parsed = parseBoundedString(data.address, 4, MAX_ADDRESS);
    if (!parsed) throw new OrderError("invalid");
    address = parsed;
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
  return {
    id: dish.slug,
    categorySlug: dish.categorySlug ?? "",
    name,
    price: dish.price,
    image: dish.image ?? "",
    imageAlt: name,
    weight: dish.weight ?? undefined,
    quantity,
  };
}

/**
 * Builds an order from client-supplied ids/quantities and customer fields.
 * Prices, names and availability always come from live Sanity documents.
 */
export async function resolveOrder(body: unknown): Promise<ResolvedOrder> {
  const data = asRecord(body);
  if (!data) throw new OrderError("invalid");

  const customer = parseCustomer(data.customer);
  const lines = parseLines(data.items);
  const locale = parseLocale(data.locale);
  const slugs = lines.map((line) => line.id);

  const dishes = await client.fetch<OrderDish[]>(
    DISHES_BY_SLUGS_QUERY,
    { slugs, locale },
    { next: { revalidate: 0 } },
  );

  const bySlug = new Map(dishes.map((dish) => [dish.slug, dish]));
  const items: CartItem[] = [];
  const telegramItems: CartItem[] = [];

  for (const line of lines) {
    const dish = bySlug.get(line.id);
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

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { customer, items, telegramItems, total };
}
