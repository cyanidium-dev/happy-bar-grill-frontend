/**
 * Cart + order types. A `CartLine` is the product payload added from a dish
 * card / dish page; `CartItem` adds the quantity once it's in the cart.
 */

export type CartLine = {
  /** Stable id — the dish slug (unique per dish). */
  id: string;
  name: string;
  price: number;
  image: string;
  imageAlt?: string;
  /** Weight in grams (optional, shown under the name). */
  weight?: number;
};

export type CartItem = CartLine & { quantity: number };

export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  payment: string;
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
