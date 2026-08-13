import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  CartLine,
  LastOrder,
  OrderCustomer,
} from "@/types/cart";

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

/**
 * Cart store (zustand + localStorage persistence). Holds the live cart and the
 * last placed order. UI reads counts/totals via the selectors below; guard
 * rendered counts with `useCartHydrated` to avoid SSR/client mismatches.
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
        set((state) => {
          const index = state.items.findIndex((it) => it.id === line.id);
          if (index !== -1) {
            return {
              items: state.items.map((it, i) =>
                i === index
                  ? { ...it, ...line, quantity: it.quantity + quantity }
                  : it,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        });
      },

      increase: (id) => {
        if (get().isLocked) return;
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, quantity: it.quantity + 1 } : it,
          ),
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
      partialize: (state) => ({
        items: state.items,
        lastOrder: state.lastOrder,
      }),
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((n, it) => n + it.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

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
