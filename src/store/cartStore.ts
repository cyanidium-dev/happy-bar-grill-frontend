import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  CartLine,
  LastOrder,
  OrderCustomer,
} from "@/types/cart";
import { MAX_CART_QUANTITY, normalizeCartQuantity } from "@/utils/cartQuantity";
import { cartLineId, dishSlugOf, parseCartLineId } from "@/utils/cartLine";

interface CartState {
  items: CartItem[];
  /** Persisted snapshot of the most recently placed order (for confirmation). */
  lastOrder: LastOrder | null;
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
   * Snapshots a server-verified order into `lastOrder`, empties the cart,
   * and returns the order. Totals/lines must come from `/api/orders`.
   */
  placeOrder: (
    customer: OrderCustomer,
    verified: { orderNumber: string; items: CartItem[]; total: number },
  ) => LastOrder;
  /** Merges every line from `lastOrder` into the live cart (quantities add up). */
  repeatLastOrder: () => void;
}

function sanitizeCartItems(items: CartItem[]): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const quantity = normalizeCartQuantity(item?.quantity);
    if (!item?.id || quantity === null) return [];

    const parsed = parseCartLineId(item.id);
    const slug = item.slug || parsed.slug;
    const categorySlug = item.categorySlug || parsed.categorySlug || undefined;
    const id = categorySlug ? cartLineId(categorySlug, slug) : item.id;

    return [{ ...item, id, slug, categorySlug, quantity }];
  });
}

function sanitizeLastOrder(raw: unknown): LastOrder | null {
  if (!raw || typeof raw !== "object") return null;
  const order = raw as Partial<LastOrder>;
  if (typeof order.orderNumber !== "string" || !order.orderNumber) return null;
  return {
    ...order,
    orderNumber: order.orderNumber,
    items: sanitizeCartItems(order.items ?? []),
    total:
      typeof order.total === "number" && Number.isFinite(order.total)
        ? order.total
        : 0,
    customer: order.customer as LastOrder["customer"],
    createdAt: typeof order.createdAt === "string" ? order.createdAt : "",
  };
}

type PersistedCart = Pick<CartState, "items" | "lastOrder">;

function toPersistedCart(raw: unknown): PersistedCart {
  const stored =
    raw && typeof raw === "object" ? (raw as Partial<PersistedCart>) : {};
  return {
    items: sanitizeCartItems(stored.items ?? []),
    lastOrder: sanitizeLastOrder(stored.lastOrder),
  };
}

/**
 * Bump this when `PersistedCart` changes, and add a `fromVersion < N` step in
 * `migrateCart`. Stored snapshots without `version` are treated as `0`.
 */
export const CART_PERSIST_VERSION = 1;

function migrateCart(
  persistedState: unknown,
  fromVersion: number,
): PersistedCart {
  // v0 snapshots (no version / zustand default 0) are normalized here.
  // When bumping CART_PERSIST_VERSION, add `if (fromVersion < N) { ... }`.
  void fromVersion;
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
 * the live cart and the last placed order. UI reads counts/totals via the
 * selectors below; guard rendered counts with `useCartHydrated` to avoid
 * SSR/client mismatches.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastOrder: null,
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
        const order: LastOrder = {
          orderNumber: verified.orderNumber,
          items: verified.items,
          total: verified.total,
          customer,
          createdAt: new Date().toISOString(),
        };
        set({ lastOrder: order, items: [], isLocked: false });
        return order;
      },

      repeatLastOrder: () => {
        if (get().isLocked) return;
        const { lastOrder, addItem } = get();
        if (!lastOrder) return;
        for (const item of lastOrder.items) {
          const { quantity, ...line } = item;
          addItem(line, quantity);
        }
      },
    }),
    {
      name: "vtiha-cart",
      version: CART_PERSIST_VERSION,
      migrate: migrateCart,
      partialize: (state) => ({
        items: state.items,
        lastOrder: state.lastOrder,
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
