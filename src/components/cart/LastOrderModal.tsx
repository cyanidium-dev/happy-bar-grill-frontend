"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartHydrated, useCartStore } from "@/store/cartStore";
import ReceiptIcon from "@/components/shared/icons/ReceiptIcon";
import CloseIcon from "@/components/shared/icons/CloseIcon";
import Container from "@/components/shared/container/Container";
import { buttonStyles, Sheen } from "@/components/shared/buttons/Button";
import { lockBodyScroll } from "@/lib/lockBodyScroll";
import { cn } from "@/utils/cn";
import { dishHref } from "@/utils/dishHref";

/**
 * Compact previous-order panel. Anchored to the page container (same gutters as
 * the header), lists last-order lines and offers "Repeat order" to merge them
 * into the cart.
 */
export default function LastOrderModal({
  open,
  onClose,
  onOpenCart,
}: {
  open: boolean;
  onClose: () => void;
  /** Called after last-order lines are merged into the cart. */
  onOpenCart: () => void;
}) {
  const t = useTranslations("LastOrder");
  const tp = useTranslations("Product");
  const hydrated = useCartHydrated();
  const lastOrder = useCartStore((s) => s.lastOrder);
  const repeatLastOrder = useCartStore((s) => s.repeatLastOrder);

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

  if (!hydrated || !lastOrder) return null;

  const handleRepeat = () => {
    repeatLastOrder();
    onClose();
    onOpenCart();
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-transparent transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-[calc(var(--header-height)+0.5rem)] z-[70] pr-[var(--scroll-lock-offset,0px)] transition-[opacity,transform] duration-300 ease-out",
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <Container className="flex justify-end">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className={cn(
              "flex w-full max-w-[360px] max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-tl-2xl rounded-br-2xl border border-navy/10 bg-beige shadow-2xl",
              open ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
              <h2 className="flex items-center gap-2 font-findsans text-14bold uppercase text-navy">
                <ReceiptIcon className="size-5 shrink-0 text-red" />
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-navy transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-brand sm:px-5">
              {lastOrder.items.map((item) => {
                const href = dishHref(item);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border-b border-navy/8 py-2.5 last:border-b-0"
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-label={item.name}
                      className="relative size-12 shrink-0 overflow-hidden rounded-tl-lg rounded-br-lg"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={href}
                        onClick={onClose}
                        className="line-clamp-1 text-14semi text-navy transition-colors duration-300 hover:text-red"
                      >
                        {item.name}
                      </Link>
                      <p className="text-12med text-grey-dark">
                        {item.quantity} × {item.price} {tp("currency")}
                      </p>
                    </div>
                    <span className="shrink-0 text-14semi text-navy">
                      {item.price * item.quantity} {tp("currency")}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-navy/10 bg-white px-4 py-4 sm:px-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-14med text-graphite">{t("total")}</span>
                <span className="text-18bold text-navy">
                  {lastOrder.total} {tp("currency")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRepeat}
                className={buttonStyles({
                  variant: "primary",
                  shape: "leaf",
                  fullWidth: true,
                  size: "sm",
                })}
              >
                <Sheen />
                <span className="relative z-[1]">{t("repeat")}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
