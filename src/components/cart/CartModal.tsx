"use client";

import { useEffect } from "react";
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
import { lockBodyScroll } from "@/lib/lockBodyScroll";
import { cn } from "@/utils/cn";

/**
 * Slide-in cart panel (from the right), modeled on bravo's CartModal but in the
 * project's styling. Reads the cart from the store; the footer links to
 * checkout. Rendered once in the Header so it's available on every page.
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
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-[460px] flex-col bg-beige shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-6 lg:px-8">
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

        <div className="flex-1 overflow-y-auto px-6 scrollbar-brand lg:px-8">
          {isEmpty ? (
            <p className="py-24 text-center text-16reg text-grey-dark">
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
          <div className="border-t border-navy/10 bg-white px-6 py-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-16med text-graphite">{t("total")}</span>
              <span className="text-24bold text-navy">
                {total} {tp("currency")}
              </span>
            </div>
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
