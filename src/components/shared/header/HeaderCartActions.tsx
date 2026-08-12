"use client";

import { Sheen } from "@/components/shared/buttons/Button";
import CartIcon from "@/components/shared/icons/CartIcon";
import ReceiptIcon from "@/components/shared/icons/ReceiptIcon";
import CartButton from "./CartButton";
import {
  selectCartCount,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import { CART_FLY_TARGET_ID } from "@/lib/cartFly";
import { cn } from "@/utils/cn";

type HeaderCartActionsProps = {
  cartLabel: string;
  lastOrderLabel: string;
  onOpenCart: () => void;
  onOpenLastOrder: () => void;
};

/**
 * Header cart + last-order entry. Without a previous order, only the cart
 * button is shown. With one, a single red pill (list | cart) on all breakpoints.
 */
export default function HeaderCartActions({
  cartLabel,
  lastOrderLabel,
  onOpenCart,
  onOpenLastOrder,
}: HeaderCartActionsProps) {
  const hydrated = useCartHydrated();
  const lastOrder = useCartStore((s) => s.lastOrder);
  const count = useCartStore(selectCartCount);
  const showCount = hydrated && count > 0;

  if (!hydrated || !lastOrder) {
    return <CartButton label={cartLabel} onOpen={onOpenCart} />;
  }

  const segmentClass =
    "relative z-[1] flex h-full cursor-pointer items-center transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 xl:hover:bg-red-dark";

  return (
    <div className="relative h-8 lg:h-[41px]">
      <div className="relative flex h-full items-stretch overflow-hidden rounded-full bg-red transition duration-300 ease-out active:scale-95">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <Sheen />
        </span>

        <button
          type="button"
          onClick={onOpenLastOrder}
          aria-label={lastOrderLabel}
          className={cn(
            segmentClass,
            "justify-end rounded-l-full pl-2 pr-1 lg:pl-2.5 lg:pr-0.5",
          )}
        >
          <ReceiptIcon className="size-4.5 text-white lg:size-6" />
        </button>

        <span
          aria-hidden
          className="relative z-[1] mx-0.5 w-px shrink-0 self-stretch bg-white/30 lg:mx-0.5"
        />

        <button
          type="button"
          id={CART_FLY_TARGET_ID}
          onClick={onOpenCart}
          aria-label={cartLabel}
          className={cn(
            segmentClass,
            "justify-start rounded-r-full pr-2 pl-1 lg:pr-2.5 lg:pl-0.5",
          )}
        >
          <CartIcon className="size-4.5 text-white lg:size-6" />
        </button>
      </div>

      {showCount && (
        <span className="absolute -right-1 -top-1 z-[2] flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-10med text-navy shadow-sm ring-1 ring-navy/10">
          {count}
        </span>
      )}
    </div>
  );
}
