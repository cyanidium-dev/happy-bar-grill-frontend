"use client";

import { Sheen } from "@/components/shared/buttons/Button";
import CartIcon from "@/components/shared/icons/CartIcon";
import {
  selectCartCount,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import { CART_FLY_TARGET_ID } from "@/lib/cartFly";
import { cn } from "@/utils/cn";

/**
 * Cart entry point in the header. Opens the cart modal and shows the live item
 * count. Also the destination (`id`) for the fly-to-cart animation.
 */
export default function CartButton({
  label,
  onOpen,
  className,
}: {
  label: string;
  onOpen: () => void;
  className?: string;
}) {
  const hydrated = useCartHydrated();
  const count = useCartStore(selectCartCount);
  const showCount = hydrated && count > 0;

  return (
    <button
      type="button"
      id={CART_FLY_TARGET_ID}
      onClick={onOpen}
      aria-label={label}
      className={cn(
        "group relative flex size-8 cursor-pointer items-center justify-center rounded-full bg-red transition duration-300 ease-out enabled:active:scale-95 xl:hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 xl:size-10",
        className,
      )}
    >
      {/* Clip the sheen to the circle without clipping the count badge. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <Sheen />
      </span>
      <CartIcon className="relative z-[1] size-4.5 text-white xl:size-6" />
      {showCount && (
        <span className="absolute -right-1 -top-1 z-[1] flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-10med text-navy shadow-sm ring-1 ring-navy/10">
          {count}
        </span>
      )}
    </button>
  );
}
