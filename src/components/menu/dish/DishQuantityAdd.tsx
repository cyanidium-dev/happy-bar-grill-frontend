"use client";

import { useState } from "react";
import Button from "@/components/shared/buttons/Button";
import CartIcon from "@/components/shared/icons/CartIcon";
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
 * Quantity stepper + add-to-cart button for the dish page. Visual only for now —
 * the cart store is wired in a later step (same as `DishCard`'s quick-add).
 */
export default function DishQuantityAdd({
  labels,
}: {
  labels: DishQuantityAddLabels;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="inline-flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center rounded-full bg-beige/80 ring-1 ring-navy/10 w-fit">
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
      >
        <CartIcon className="size-5" />
        {labels.addToCart}
      </Button>
    </div>
  );
}
