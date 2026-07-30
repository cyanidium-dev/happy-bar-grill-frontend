import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "bestseller" | "new" | "discount";

const variants: Record<BadgeVariant, string> = {
  bestseller: "bg-red text-white",
  new: "bg-olive text-white",
  discount: "bg-navy text-white",
};

/** Small pill label for dish tags (Best seller / New / Акція). */
export default function Badge({
  children,
  variant = "bestseller",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-12semi uppercase tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
