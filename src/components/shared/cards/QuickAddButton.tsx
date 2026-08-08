"use client";

import Button from "@/components/shared/buttons/Button";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import { flyToCart } from "@/lib/cartFly";

/**
 * Quick add-to-cart "+" button used on `DishCard`. Triggers the fly-to-cart
 * animation from the card's photo to the header cart. Cart state itself is
 * wired in a later step — for now this is the visual add interaction.
 */
export default function QuickAddButton({
  image,
  label,
}: {
  image: string;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="primary"
      size="icon"
      shape="leaf"
      aria-label={label}
      className="pointer-events-auto"
      onClick={(event) => {
        const card = event.currentTarget.closest("article");
        const photo = card?.querySelector("img");
        flyToCart(photo ?? event.currentTarget, image);
      }}
    >
      <PlusIcon className="size-5" />
    </Button>
  );
}
