import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartLine, LastOrder, OrderCustomer } from "@/types/cart";
import { generateOrderNumber } from "@/utils/orderNumber";

interface CartState {
  items: CartItem[];
  /** Persisted snapshot of the most recently placed order (for confirmation). */
  lastOrder: LastOrder | null;
  addItem: (line: CartLine, quantity?: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  /**
   * Snapshots the cart into `lastOrder`, empties the cart, returns the order.
   * Pass `orderNumber` when it was already generated (e.g. for Telegram notify).
   */
  placeOrder: (customer: OrderCustomer, orderNumber?: string) => LastOrder;
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

      addItem: (line, quantity = 1) =>
        set((state) => {
          const index = state.items.findIndex((it) => it.id === line.id);
          if (index !== -1) {
            return {
              items: state.items.map((it, i) =>
                i === index ? { ...it, quantity: it.quantity + quantity } : it,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        }),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id ? { ...it, quantity: it.quantity + 1 } : it,
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          items: state.items.flatMap((it) =>
            it.id === id
              ? it.quantity > 1
                ? [{ ...it, quantity: it.quantity - 1 }]
                : []
              : [it],
          ),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

      clear: () => set({ items: [] }),

      placeOrder: (customer, orderNumber) => {
        const { items } = get();
        const total = items.reduce(
          (sum, it) => sum + it.price * it.quantity,
          0,
        );
        const order: LastOrder = {
          orderNumber: orderNumber ?? generateOrderNumber(),
          items,
          total,
          customer,
          createdAt: new Date().toISOString(),
        };
        set({ lastOrder: order, items: [] });
        return order;
      },
    }),
    {
      name: "happy-cart",
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
