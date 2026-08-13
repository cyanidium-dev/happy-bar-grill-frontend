"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Button from "@/components/shared/buttons/Button";
import CartIcon from "@/components/shared/icons/CartIcon";
import { useCartStore } from "@/store/cartStore";
import { flyToCart } from "@/lib/cartFly";
import type { CartLine } from "@/types/cart";
import { cn } from "@/utils/cn";

export type DishQuantityAddLabels = {
  addToCart: string;
  decrease: string;
  increase: string;
};

const MAX_QUANTITY = 99;

const stepBtn =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-20semi text-navy transition duration-300 ease-out hover:text-red disabled:cursor-not-allowed disabled:text-navy/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40";

/**
 * Quantity stepper + add-to-cart button for the dish page. Plays the
 * fly-to-cart animation, then commits the selected quantity so the header
 * count updates with the icon bump.
 */
export default function DishQuantityAdd({
  labels,
  line,
}: {
  labels: DishQuantityAddLabels;
  /** The dish being added. */
  line: CartLine;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLocked = useCartStore((s) => s.isLocked);

  return (
    <div className="inline-flex flex-col gap-3 sm:gap-4">
      <div className="flex w-fit items-center rounded-full bg-beige/80 ring-1 ring-navy/10">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          aria-label={labels.decrease}
          className={stepBtn}
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-8 text-center text-18semi text-navy tabular-nums"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          disabled={quantity >= MAX_QUANTITY}
          aria-label={labels.increase}
          className={stepBtn}
        >
          +
        </button>
      </div>

      <Button
        type="button"
        variant="primary"
        shape="leaf"
        className={cn("flex-1", "sm:flex-none sm:min-w-56")}
        disabled={isLocked}
        onClick={(event) => {
          if (isLocked) return;
          flyToCart(event.currentTarget, line.image, () => {
            flushSync(() => addItem(line, quantity));
          });
        }}
      >
        <CartIcon className="size-5" />
        {labels.addToCart}
      </Button>
    </div>
  );
}
