"use client";

import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import Button from "@/components/shared/buttons/Button";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import { useCartStore } from "@/store/cartStore";
import { flyToCart } from "@/lib/cartFly";
import type { CartLine } from "@/types/cart";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonShape = "pill" | "leaf";

/**
 * Quick add-to-cart button used on dish cards. Plays the fly-to-cart animation,
 * then commits the item so the header count updates with the icon bump.
 * Visuals default to the catalog "+" look; hero (and others) can override
 * variant/shape/icon via props.
 */
export default function QuickAddButton({
  line,
  label,
  variant = "primary",
  shape = "leaf",
  className,
  children,
}: {
  line: CartLine;
  label: string;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  className?: string;
  children?: ReactNode;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isLocked = useCartStore((s) => s.isLocked);

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      shape={shape}
      aria-label={label}
      disabled={isLocked}
      className={cn("pointer-events-auto", className)}
      onClick={(event) => {
        if (isLocked) return;
        const card = event.currentTarget.closest("article");
        const photo = card?.querySelector("img");
        flyToCart(photo ?? event.currentTarget, line.image, () => {
          flushSync(() => addItem(line));
        });
      }}
    >
      {children ?? <PlusIcon className="size-5" />}
    </Button>
  );
}
