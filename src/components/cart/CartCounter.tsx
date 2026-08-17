"use client";

import { useCartStore } from "@/store/cartStore";
import MinusIcon from "@/components/shared/icons/MinusIcon";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import { cn } from "@/utils/cn";
import { MAX_CART_QUANTITY } from "@/utils/cartQuantity";

const btn =
  "flex size-6 shrink-0 items-center justify-center rounded-full text-navy transition-colors duration-300 enabled:cursor-pointer enabled:hover:text-red disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-navy/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40";

/** Quantity stepper for a cart line, wired to the store. */
export default function CartCounter({
  id,
  quantity,
  labels,
  className,
  onDecrease,
}: {
  id: string;
  quantity: number;
  labels: { decrease: string; increase: string };
  className?: string;
  /** Optional override (e.g. animate removal when quantity would hit 0). */
  onDecrease?: () => void;
}) {
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const isLocked = useCartStore((s) => s.isLocked);
  const atMax = quantity >= MAX_CART_QUANTITY;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-1 rounded-full bg-beige/80 px-1 py-0.5 ring-1 ring-navy/10",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => (onDecrease ? onDecrease() : decrease(id))}
        disabled={isLocked}
        aria-label={labels.decrease}
        className={btn}
      >
        <MinusIcon className="size-3.5" />
      </button>
      <span className="min-w-5 text-center text-14semi text-navy tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => {
          if (atMax) return;
          increase(id);
        }}
        disabled={isLocked || atMax}
        aria-label={labels.increase}
        className={btn}
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
