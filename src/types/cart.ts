/**
 * Cart + order types. A `CartLine` is the product payload added from a dish
 * card / dish page; `CartItem` adds the quantity once it's in the cart.
 */

export type CartLine = {
  /** Unique cart key — `categorySlug/dishSlug`. */
  id: string;
  /** Dish slug (URL segment). */
  slug: string;
  /** Category slug for `/menu/[category]/[dish]`. Missing on older cart snapshots. */
  categorySlug?: string;
  name: string;
  /** Display price from the catalog; `/api/orders` recalculates from Sanity. */
  price: number;
  image: string;
  imageAlt?: string;
  /** Weight in grams (optional, shown under the name). */
  weight?: number;
};

export type CartItem = CartLine & { quantity: number };

export type DeliveryType = "delivery" | "pickup";
export type OrderTimeMode = "asap" | "scheduled";
export type PaymentMethod = "cash" | "card";

/** Ids + quantities sent to `/api/orders`. Prices are never trusted from the client. */
export type OrderLineRequest = {
  id: string;
  quantity: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  /** Required when `deliveryType` is `"delivery"`. */
  address?: string;
  timeMode: OrderTimeMode;
  /** Desired time (`HH:mm`) when `timeMode` is `"scheduled"`. */
  scheduledAt?: string;
  payment: PaymentMethod;
  /** Optional free-form note for the order. */
  comment?: string;
};

export type LastOrder = {
  orderNumber: string;
  items: CartItem[];
  total: number;
  customer: OrderCustomer;
  /** ISO timestamp of when the order was placed. */
  createdAt: string;
};
