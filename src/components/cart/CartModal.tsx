"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  selectCartTotal,
  useCartHydrated,
  useCartStore,
} from "@/store/cartStore";
import CartItemRow from "./CartItemRow";
import CartIcon from "@/components/shared/icons/CartIcon";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import { buttonStyles, Sheen } from "@/components/shared/buttons/Button";
import { useSheetDrag } from "@/components/shared/sheet/useSheetDrag";
import { MIN_ORDER_AMOUNT } from "@/constants/contacts";
import { lockBodyScroll } from "@/lib/lockBodyScroll";
import { cn } from "@/utils/cn";

/**
 * The cart panel, in two shapes.
 *
 * On phones it is a bottom sheet: it rises from the bottom edge, sits under
 * the thumb, and is dismissed by sliding it back down — either with the close
 * button or by dragging the handle. That direction is the whole point of the
 * mobile layout; the primary controls (the cart tab, the sheet, the checkout
 * button) all live in the bottom third of the screen, where a thumb actually
 * reaches.
 *
 * From `lg` up it is the original right-hand drawer, dismissed sideways.
 * One component rather than two because the contents, the store wiring and
 * the scroll lock are identical — only the axis changes.
 *
 * Rendered once in the Header, so it is available on every page.
 */
export default function CartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Cart");
  const tp = useTranslations("Product");
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const sheetRef = useRef<HTMLElement>(null);
  const { handleProps } = useSheetDrag({
    sheetRef,
    enabled: open,
    onDismiss: onClose,
  });

  useEffect(() => {
    if (!open) return;
    const unlock = lockBodyScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const isEmpty = !hydrated || items.length === 0;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-navy-dark/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={cn(
          "fixed z-[70] flex flex-col bg-beige shadow-2xl",
          "transition-transform duration-300 ease-out",
          // Phone: a sheet pinned to the bottom edge. `svh` (not `vh`) so the
          // height doesn't jump as mobile Safari's toolbar collapses.
          "inset-x-0 bottom-0 max-h-[86svh] rounded-tl-2xl rounded-tr-2xl",
          // Desktop: the original full-height drawer on the right.
          "lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-full lg:max-w-[460px] lg:rounded-none",
          open
            ? "translate-y-0 lg:translate-x-0"
            : "translate-y-full lg:translate-y-0 lg:translate-x-full",
        )}
      >
        {/* Grab area. The handle and the title row drag together; the list
            below keeps its own scrolling. */}
        <div {...handleProps} className="shrink-0 touch-none lg:touch-auto">
          <div className="flex justify-center pt-2.5 lg:hidden">
            <span
              aria-hidden
              className="h-1 w-10 rounded-full bg-navy/20"
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-4 lg:px-8 lg:pt-6">
            <h2 className="flex items-center gap-3 font-findsans text-24bold uppercase text-navy">
              <CartIcon className="size-6 text-red" />
              {t("title")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-navy transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 scrollbar-brand lg:px-8">
          {isEmpty ? (
            <p className="py-16 text-center text-16reg text-grey-dark lg:py-24">
              {t("empty")}
            </p>
          ) : (
            <ul className="flex flex-col overflow-x-clip pb-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} onNavigate={onClose} />
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="shrink-0 border-t border-navy/10 bg-white px-6 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:px-8 lg:py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-16med text-graphite">{t("total")}</span>
              <span className="text-24bold text-navy">
                {total} {tp("currency")}
              </span>
            </div>
            {total < MIN_ORDER_AMOUNT && (
              <p className="mb-4 text-14reg text-graphite">
                {t("minOrder", { remaining: MIN_ORDER_AMOUNT - total })}
              </p>
            )}
            <Link
              href="/checkout"
              onClick={onClose}
              className={buttonStyles({
                variant: "primary",
                shape: "leaf",
                fullWidth: true,
              })}
            >
              <Sheen />
              <span className="relative z-[1]">{t("checkout")}</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
