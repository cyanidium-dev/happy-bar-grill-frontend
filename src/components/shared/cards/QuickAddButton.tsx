"use client";

import Button from "@/components/shared/buttons/Button";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import { useCartStore } from "@/store/cartStore";
import { flyToCart } from "@/lib/cartFly";
import type { CartLine } from "@/types/cart";

/**
 * Quick add-to-cart "+" button used on `DishCard`. Adds the dish to the cart
 * store and plays the fly-to-cart animation from the card's photo.
 */
export default function QuickAddButton({
  line,
  label,
}: {
  line: CartLine;
  label: string;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      type="button"
      variant="primary"
      size="icon"
      shape="leaf"
      aria-label={label}
      className="pointer-events-auto"
      onClick={(event) => {
        addItem(line);
        const card = event.currentTarget.closest("article");
        const photo = card?.querySelector("img");
        flyToCart(photo ?? event.currentTarget, line.image);
      }}
    >
      <PlusIcon className="size-5" />
    </Button>
  );
}
