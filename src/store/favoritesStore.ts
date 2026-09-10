import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/cart";
import { cartLineId, dishSlugOf, parseCartLineId } from "@/utils/cartLine";

/**
 * Favourites are stored as full catalog snapshots, not as bare ids.
 *
 * That is what lets `/favorites` render instantly and offline: the page has
 * everything it needs to draw a card and add the dish to the cart without a
 * Sanity round-trip. The trade-off is staleness — a price edited in the CMS is
 * not reflected until the dish is seen again — which is why the cart is always
 * re-priced on the server at checkout, and why the favourites page links to
 * the live dish page for anything authoritative.
 */

export type FavoriteItem = CartLine & {
  /** ISO timestamp, so the list can show newest first. */
  addedAt: string;
};

/** Keeps localStorage bounded; older entries fall off the end. */
export const MAX_FAVORITES = 100;

interface FavoritesState {
  items: FavoriteItem[];
  /** Adds if absent, removes if present. Returns the state after the toggle. */
  toggle: (line: CartLine) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

function sanitizeImage(value: unknown): string {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src) return "";
  if (src.startsWith("/")) return src;
  return /^https:\/\//i.test(src) ? src : "";
}

/**
 * Mirrors the cart's sanitizer: a hand-edited or stale localStorage entry must
 * never reach `next/image` with a `javascript:` src or a non-numeric price.
 */
function sanitizeFavorites(raw: unknown): FavoriteItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();

  return raw
    .flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Partial<FavoriteItem>;
      if (!item.id || typeof item.id !== "string") return [];
      if (typeof item.name !== "string" || !item.name.trim()) return [];
      if (
        typeof item.price !== "number" ||
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        return [];
      }

      const parsed = parseCartLineId(item.id);
      const slug = item.slug || parsed.slug;
      const categorySlug = item.categorySlug || parsed.categorySlug || undefined;
      const id = categorySlug ? cartLineId(categorySlug, slug) : item.id;
      if (seen.has(id)) return [];
      seen.add(id);

      return [
        {
          id,
          slug,
          categorySlug,
          name: item.name.trim(),
          price: item.price,
          image: sanitizeImage(item.image),
          imageAlt: item.imageAlt?.trim() || item.name.trim(),
          weight:
            typeof item.weight === "number" && Number.isFinite(item.weight)
              ? item.weight
              : undefined,
          addedAt:
            typeof item.addedAt === "string" && item.addedAt
              ? item.addedAt
              : new Date(0).toISOString(),
        } satisfies FavoriteItem,
      ];
    })
    .slice(0, MAX_FAVORITES);
}

function toFavorite(line: CartLine): FavoriteItem {
  const name = line.name.trim();
  const slug = line.slug || dishSlugOf(line);
  const categorySlug = line.categorySlug;
  return {
    id: categorySlug ? cartLineId(categorySlug, slug) : line.id,
    slug,
    categorySlug,
    name,
    price: line.price,
    image: sanitizeImage(line.image),
    imageAlt: line.imageAlt?.trim() || name,
    weight: line.weight,
    addedAt: new Date().toISOString(),
  };
}

export const FAVORITES_PERSIST_VERSION = 1;

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (line) => {
        const favorite = toFavorite(line);
        const exists = get().items.some((it) => it.id === favorite.id);

        set((state) =>
          exists
            ? { items: state.items.filter((it) => it.id !== favorite.id) }
            : // Newest first, so the list reads as a recent-interest feed.
              { items: [favorite, ...state.items].slice(0, MAX_FAVORITES) },
        );

        return !exists;
      },

      remove: (id) =>
        set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "vtiha-favorites",
      version: FAVORITES_PERSIST_VERSION,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        items: sanitizeFavorites(
          (persisted as { items?: unknown } | null)?.items,
        ),
      }),
    },
  ),
);

export const selectFavoriteCount = (state: FavoritesState) =>
  state.items.length;

/** `true` while `id` is in the list. Build `id` with `cartLineId`. */
export const selectIsFavorite = (id: string) => (state: FavoritesState) =>
  state.items.some((it) => it.id === id);

/** Mirrors `useCartHydrated` — defer rendering counts until localStorage lands. */
export function useFavoritesHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useFavoritesStore.persist.onFinishHydration(onChange),
    () => useFavoritesStore.persist.hasHydrated(),
    () => false,
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== useFavoritesStore.persist.getOptions().name) return;
    void useFavoritesStore.persist.rehydrate();
  });
}
