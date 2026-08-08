"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import CartCounter from "./CartCounter";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import type { CartItem } from "@/types/cart";

/** A single cart line: photo, name, price/weight, quantity stepper, remove. */
export default function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("Product");
  const tc = useTranslations("Cart");
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 rounded-tl-xl rounded-br-xl border border-navy/12 bg-white p-3">
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-tl-lg rounded-br-lg">
        {item.image && (
          <Image
            src={item.image}
            alt={item.imageAlt || item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="mb-1 font-findsans line-clamp-2 text-14semi text-navy">{item.name}</p>
        <p className="mt-0.5 font-findsans text-12semi text-navy">
          {item.price} {t("currency")}
          {item.weight ? (
            <span className="ml-1.5 text-12med text-grey-dark">
              {item.weight} {t("weightUnit")}
            </span>
          ) : null}
        </p>
        <div className="mt-auto pt-2">
          <CartCounter
            id={item.id}
            quantity={item.quantity}
            labels={{ decrease: tc("decrease"), increase: tc("increase") }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={tc("remove")}
        className="size-8 shrink-0 cursor-pointer text-grey-dark transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
      >
        <TrashIcon className="size-5" />
      </button>
    </div>
  );
}
