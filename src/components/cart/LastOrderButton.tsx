"use client";

import { Sheen } from "@/components/shared/buttons/Button";
import ReceiptIcon from "@/components/shared/icons/ReceiptIcon";
import { useCartHydrated, useCartStore } from "@/store/cartStore";
import { cn } from "@/utils/cn";

/**
 * Header entry for the previous order. Same chrome as `CartButton`; only rendered
 * once the store has hydrated and a `lastOrder` exists.
 */
export default function LastOrderButton({
  label,
  onOpen,
  className,
}: {
  label: string;
  onOpen: () => void;
  className?: string;
}) {
  const hydrated = useCartHydrated();
  const lastOrder = useCartStore((s) => s.lastOrder);

  if (!hydrated || !lastOrder) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className={cn(
        "group relative flex size-8 cursor-pointer items-center justify-center rounded-full bg-red transition duration-300 ease-out enabled:active:scale-95 xl:hover:bg-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:size-[41px]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <Sheen />
      </span>
      <ReceiptIcon className="relative z-[1] size-5 text-white lg:size-6" />
    </button>
  );
}
