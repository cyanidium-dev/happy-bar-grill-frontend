import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type ChipVariant = "soft" | "glass" | "outline";

const variants: Record<ChipVariant, string> = {
  // On light/beige surfaces.
  soft: "bg-white text-navy shadow-card",
  // On photos / gradients — translucent frosted pill.
  glass: "bg-white/55 text-navy ring-1 ring-white/70 backdrop-blur-sm",
  // Minimal, border only.
  outline: "border border-navy/20 text-navy",
};

/**
 * Small informational pill (trust badges, stat chips, future filters).
 * Distinct from `Badge`, which is the coloured dish-tag label. Compose the
 * leading icon inside `children`.
 */
export default function Chip({
  children,
  variant = "soft",
  className,
}: {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-14med",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
