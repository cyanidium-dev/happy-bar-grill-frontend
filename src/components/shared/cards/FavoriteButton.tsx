"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import HeartIcon from "@/components/shared/icons/HeartIcon";
import {
  useFavoritesHydrated,
  useFavoritesStore,
} from "@/store/favoritesStore";
import type { CartLine } from "@/types/cart";
import { cn } from "@/utils/cn";

/**
 * Favourite toggle for a dish.
 *
 * Renders as an unfilled heart until the persisted store has hydrated, so the
 * server HTML and the first client render agree — the same reason the cart
 * count is gated on `useCartHydrated`. Filling it in a frame later is far less
 * jarring than a hydration mismatch that blanks the card.
 *
 * `pointer-events-auto` is required on cards: `DishCard` covers itself with a
 * stretched link and turns pointer events off for its content so clicks fall
 * through to the dish page.
 */
export default function FavoriteButton({
  line,
  className,
  size = "md",
}: {
  line: CartLine;
  className?: string;
  /** `md` for cards, `lg` for the dish page header. */
  size?: "md" | "lg";
}) {
  const t = useTranslations("Favorites");
  const hydrated = useFavoritesHydrated();
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore(
    (s) => hydrated && s.items.some((it) => it.id === line.id),
  );
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(event) => {
        // The whole card is a link; favouriting must not navigate.
        event.preventDefault();
        event.stopPropagation();
        const added = toggle(line);
        setJustAdded(added);
      }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t("remove") : t("add")}
      title={isFavorite ? t("remove") : t("add")}
      className={cn(
        // No `backdrop-blur` here: this button scales on press, and a
        // backdrop filter under a transform smears in Chrome/Safari (the
        // same reason the rest of the site animates opacity only). A nearly
        // opaque white reads the same over a photo anyway.
        "pointer-events-auto flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm transition duration-300 ease-out active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50",
        size === "lg" ? "size-11" : "size-8",
        isFavorite ? "text-red" : "text-navy/45 xl:hover:text-red",
        className,
      )}
    >
      <HeartIcon
        filled={isFavorite}
        className={cn(
          size === "lg" ? "size-6" : "size-4.5",
          // A one-shot pop on add only — removing should feel undramatic.
          justAdded && isFavorite && "animate-heart-pop",
        )}
      />
    </button>
  );
}
