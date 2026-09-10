import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppliedPromo,
  CartItem,
  CartLine,
  OrderCustomer,
  PlacedOrder,
} from "@/types/cart";
import { MAX_CART_QUANTITY, normalizeCartQuantity } from "@/utils/cartQuantity";
import { cartLineId, dishSlugOf, parseCartLineId } from "@/utils/cartLine";

/**
 * How many past orders to keep. The history is a re-ordering convenience, not
 * an archive — and it lives in localStorage, which is a few megabytes shared
 * with everything else on the origin.
 */
export const MAX_ORDER_HISTORY = 20;

interface CartState {
  items: CartItem[];
  /** Placed orders, newest first. Capped at `MAX_ORDER_HISTORY`. */
  orders: PlacedOrder[];
  /** When true, quantity/add/remove are no-ops (checkout request in flight). */
  isLocked: boolean;
  lockCart: () => void;
  unlockCart: () => void;
  addItem: (line: CartLine, quantity?: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  /**
   * Snapshots a server-verified order onto the front of `orders`, empties the
   * cart, and returns the order. Totals/lines must come from `/api/orders`.
   */
  placeOrder: (
    customer: OrderCustomer,
    verified: {
      orderNumber: string;
      items: CartItem[];
      subtotal: number;
      total: number;
      promo?: AppliedPromo;
    },
  ) => PlacedOrder;
  /** Merges every line of `orderNumber` into the live cart (quantities add up). */
  repeatOrder: (orderNumber: string) => void;
  /** Merges every line from the most recent order into the live cart. */
  repeatLastOrder: () => void;
  /** Drops the whole order history (the live cart is untouched). */
  clearOrders: () => void;
}

/** Finite, non-negative catalog price; `null` for NaN, negatives, non-numbers. */
function normalizeCartPrice(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

/**
 * Keep only image sources `next/image` can render: an empty string, a
 * root-relative path, or an `https:` URL. A tampered or stale snapshot with a
 * `javascript:` / `data:` / `http:` value would otherwise throw at render.
 */
function sanitizeCartImage(value: unknown): string {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src) return "";
  if (src.startsWith("/")) return src;
  return /^https:\/\//i.test(src) ? src : "";
}

function sanitizeCartItems(items: CartItem[]): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const quantity = normalizeCartQuantity(item?.quantity);
    const price = normalizeCartPrice(item?.price);
    if (!item?.id || quantity === null || price === null) return [];

    const parsed = parseCartLineId(item.id);
    const slug = item.slug || parsed.slug;
    const categorySlug = item.categorySlug || parsed.categorySlug || undefined;
    const id = categorySlug ? cartLineId(categorySlug, slug) : item.id;

    return [
      {
        ...item,
        id,
        slug,
        categorySlug,
        quantity,
        price,
        image: sanitizeCartImage(item.image),
      },
    ];
  });
}

function finiteAmount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

function sanitizePromo(raw: unknown): AppliedPromo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const promo = raw as Partial<AppliedPromo>;
  const amount = finiteAmount(promo.amount);
  if (typeof promo.code !== "string" || !promo.code.trim() || amount === null) {
    return undefined;
  }
  return { code: promo.code.trim().toUpperCase(), amount };
}

function sanitizeOrder(raw: unknown): PlacedOrder | null {
  if (!raw || typeof raw !== "object") return null;
  const order = raw as Partial<PlacedOrder>;
  if (typeof order.orderNumber !== "string" || !order.orderNumber) return null;

  const items = sanitizeCartItems(order.items ?? []);
  const promo = sanitizePromo(order.promo);

  // Pre-promo snapshots (v1) carried no `subtotal`; recompute it from lines so
  // history rows can show a discount breakdown without special-casing them.
  const subtotal =
    finiteAmount(order.subtotal) ??
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    orderNumber: order.orderNumber,
    items,
    subtotal,
    promo,
    total: finiteAmount(order.total) ?? Math.max(0, subtotal - (promo?.amount ?? 0)),
    customer: order.customer as PlacedOrder["customer"],
    createdAt: typeof order.createdAt === "string" ? order.createdAt : "",
  };
}

function sanitizeOrders(raw: unknown): PlacedOrder[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .flatMap((entry) => {
      const order = sanitizeOrder(entry);
      return order ? [order] : [];
    })
    .slice(0, MAX_ORDER_HISTORY);
}

type PersistedCart = Pick<CartState, "items" | "orders">;

function toPersistedCart(raw: unknown): PersistedCart {
  const stored =
    raw && typeof raw === "object" ? (raw as Partial<PersistedCart>) : {};
  return {
    items: sanitizeCartItems(stored.items ?? []),
    orders: sanitizeOrders(stored.orders ?? []),
  };
}

/**
 * Bump this when `PersistedCart` changes, and add a `fromVersion < N` step in
 * `migrateCart`. Stored snapshots without `version` are treated as `0`.
 *
 * v1 → v2: the single `lastOrder` became the `orders` history list.
 */
export const CART_PERSIST_VERSION = 2;

function migrateCart(
  persistedState: unknown,
  fromVersion: number,
): PersistedCart {
  const stored =
    persistedState && typeof persistedState === "object"
      ? (persistedState as Record<string, unknown>)
      : {};

  if (fromVersion < 2) {
    // Promote the one remembered order into the new history list so an
    // existing customer's "repeat order" button survives the upgrade.
    const migrated = sanitizeOrder(stored.lastOrder);
    return {
      items: sanitizeCartItems((stored.items as CartItem[]) ?? []),
      orders: migrated ? [migrated] : [],
    };
  }

  return toPersistedCart(persistedState);
}

/**
 * Catalog snapshot written into the cart. Always taken from the payload
 * (menu card / dish page), so a second add picks up CMS name/price/photo
 * changes instead of keeping the first-add localStorage values.
 */
function fromCatalogLine(
  line: CartLine,
  quantity: number,
  existing?: CartItem,
): CartItem {
  const name = line.name.trim();
  const slug = line.slug || dishSlugOf(line);
  const categorySlug = line.categorySlug || existing?.categorySlug;
  return {
    id: categorySlug ? cartLineId(categorySlug, slug) : line.id,
    slug,
    categorySlug,
    name,
    price: line.price,
    image: line.image,
    imageAlt: line.imageAlt?.trim() || name,
    weight: line.weight,
    quantity,
  };
}

/**
 * Cart store (zustand + localStorage persistence, synced across tabs). Holds
 * the live cart and the order history. UI reads counts/totals via the
 * selectors below; guard rendered counts with `useCartHydrated` to avoid
 * SSR/client mismatches.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      isLocked: false,

      lockCart: () => set({ isLocked: true }),
      unlockCart: () => set({ isLocked: false }),

      addItem: (line, quantity = 1) => {
        if (get().isLocked) return;
        const qty = normalizeCartQuantity(quantity);
        if (qty === null) return;
        set((state) => {
          const index = state.items.findIndex(
            (it) =>
              it.id === line.id ||
              (Boolean(line.categorySlug) &&
                it.categorySlug === line.categorySlug &&
                dishSlugOf(it) === dishSlugOf(line)),
          );
          if (index !== -1) {
            return {
              items: state.items.map((it, i) => {
                if (i !== index) return it;
                const current = normalizeCartQuantity(it.quantity) ?? 0;
                return fromCatalogLine(
                  line,
                  Math.min(MAX_CART_QUANTITY, current + qty),
                  it,
                );
              }),
            };
          }
          return {
            items: [...state.items, fromCatalogLine(line, qty)],
          };
        });
      },

      increase: (id) => {
        if (get().isLocked) return;
        set((state) => ({
          items: state.items.map((it) => {
            if (it.id !== id) return it;
            const current =
              typeof it.quantity === "number" && Number.isFinite(it.quantity)
                ? Math.trunc(it.quantity)
                : 0;
            return {
              ...it,
              quantity: Math.min(MAX_CART_QUANTITY, Math.max(0, current) + 1),
            };
          }),
        }));
      },

      decrease: (id) => {
        if (get().isLocked) return;
        set((state) => ({
          items: state.items.flatMap((it) =>
            it.id === id
              ? it.quantity > 1
                ? [{ ...it, quantity: it.quantity - 1 }]
                : []
              : [it],
          ),
        }));
      },

      removeItem: (id) => {
        if (get().isLocked) return;
        set((state) => ({ items: state.items.filter((it) => it.id !== id) }));
      },

      clear: () => {
        if (get().isLocked) return;
        set({ items: [] });
      },

      placeOrder: (customer, verified) => {
        const order: PlacedOrder = {
          orderNumber: verified.orderNumber,
          items: verified.items,
          subtotal: verified.subtotal,
          promo: verified.promo,
          total: verified.total,
          customer,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          // A retried request that resolves twice must not duplicate the row.
          orders: [
            order,
            ...state.orders.filter(
              (it) => it.orderNumber !== order.orderNumber,
            ),
          ].slice(0, MAX_ORDER_HISTORY),
          items: [],
          isLocked: false,
        }));
        return order;
      },

      repeatOrder: (orderNumber) => {
        if (get().isLocked) return;
        const { orders, addItem } = get();
        const order = orders.find((it) => it.orderNumber === orderNumber);
        if (!order) return;
        for (const item of order.items) {
          const { quantity, ...line } = item;
          addItem(line, quantity);
        }
      },

      repeatLastOrder: () => {
        const last = get().orders[0];
        if (!last) return;
        get().repeatOrder(last.orderNumber);
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "vtiha-cart",
      version: CART_PERSIST_VERSION,
      migrate: migrateCart,
      partialize: (state) => ({
        items: state.items,
        orders: state.orders,
      }),
      merge: (persisted, current) => {
        const stored = toPersistedCart(persisted);
        return {
          ...current,
          ...stored,
          isLocked: false,
        };
      },
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((n, it) => n + it.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

/** Most recently placed order, or `null` before the first one. */
export const selectLastOrder = (state: CartState): PlacedOrder | null =>
  state.orders[0] ?? null;

export const selectOrderCount = (state: CartState) => state.orders.length;

/**
 * Keep sibling tabs in sync. `storage` fires only in *other* windows when
 * localStorage changes, so this tab's in-flight checkout (`isLocked`) is left
 * alone until it finishes writing the order snapshot.
 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== useCartStore.persist.getOptions().name) return;
    if (useCartStore.getState().isLocked) return;
    void useCartStore.persist.rehydrate();
  });
}

/**
 * `true` once the persisted store has hydrated on the client. Use it to defer
 * rendering cart counts/items so server and first client render agree (the
 * server snapshot is always `false`, i.e. an empty cart).
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
