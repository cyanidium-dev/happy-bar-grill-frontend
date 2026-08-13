"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cartStore";
import CartCounter from "./CartCounter";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import type { CartItem } from "@/types/cart";
import { cn } from "@/utils/cn";
import { dishHref } from "@/utils/dishHref";

const SLIDE_MS = 320;
const COLLAPSE_MS = 280;

type ExitPhase = "idle" | "slide" | "collapse";

/** A single cart line: photo, name, price/weight, quantity stepper, remove. */
export default function CartItemRow({
  item,
  onNavigate,
}: {
  item: CartItem;
  /** Called when the dish photo/name link is followed (e.g. close the cart). */
  onNavigate?: () => void;
}) {
  const t = useTranslations("Product");
  const tc = useTranslations("Cart");
  const removeItem = useCartStore((s) => s.removeItem);
  const decrease = useCartStore((s) => s.decrease);
  const [phase, setPhase] = useState<ExitPhase>("idle");

  useEffect(() => {
    if (phase === "slide") {
      const timer = window.setTimeout(() => setPhase("collapse"), SLIDE_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "collapse") {
      const timer = window.setTimeout(() => removeItem(item.id), COLLAPSE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase, item.id, removeItem]);

  const requestRemove = () => {
    if (phase !== "idle") return;
    // globals.css zeros out transitions under prefers-reduced-motion —
    // skip the staged exit so we don't leave a blank gap for ~500ms.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      removeItem(item.id);
      return;
    }
    setPhase("slide");
  };

  const isExiting = phase !== "idle";
  const href = dishHref(item);

  return (
    <li
      className={cn(
        "grid ease-out",
        phase === "collapse"
          ? "grid-rows-[0fr] transition-[grid-template-rows] duration-[280ms]"
          : "grid-rows-[1fr]",
      )}
      aria-hidden={isExiting || undefined}
    >
      {/* Keep overflow visible while sliding so translateX isn't clipped mid-row;
          clip only when collapsing height so lower items can rise. */}
      <div
        className={
          phase === "collapse" ? "overflow-hidden" : "overflow-visible"
        }
      >
        <div
          className={cn(
            "pb-3",
            phase === "slide" && "animate-cart-item-exit",
            phase === "collapse" && "translate-x-[110%] opacity-0",
          )}
        >
          <div className="flex gap-3 rounded-tl-xl rounded-br-xl border border-navy/12 bg-white p-3">
            <Link
              href={href}
              onClick={onNavigate}
              aria-label={item.name}
              className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-tl-lg rounded-br-lg"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={href}
                onClick={onNavigate}
                className="mb-1 font-findsans line-clamp-2 text-14semi text-navy transition-colors duration-300 hover:text-red"
              >
                {item.name}
              </Link>
              <p className="mt-0.5 font-findsans text-12semi text-navy">
                {item.price} {t("currency")}
                {item.weight ? (
                  <span className="ml-1.5 text-10med text-grey-dark">
                    {item.weight} {t("weightUnit")}
                  </span>
                ) : null}
              </p>
              <div className="mt-auto pt-2">
                <CartCounter
                  id={item.id}
                  quantity={item.quantity}
                  labels={{
                    decrease: tc("decrease"),
                    increase: tc("increase"),
                  }}
                  onDecrease={
                    item.quantity <= 1 ? requestRemove : () => decrease(item.id)
                  }
                />
              </div>
            </div>

            <button
              type="button"
              onClick={requestRemove}
              disabled={isExiting}
              aria-label={tc("remove")}
              className="size-8 shrink-0 cursor-pointer text-grey-dark transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 disabled:pointer-events-none"
            >
              <TrashIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
