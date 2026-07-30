import { cn } from "@/utils/cn";

type PlaceholderBackground = "white" | "beige";

const backgrounds: Record<PlaceholderBackground, string> = {
  white: "bg-white",
  beige: "bg-beige",
};

/**
 * Brand-tinted stand-in for real photography (not wired to the CMS yet).
 * Swap for `CardMedia` / `next/image` once assets exist. Sizing comes from
 * `className` (e.g. `aspect-[4/3]`).
 */
export default function ImagePlaceholder({
  label,
  background = "white",
  className,
}: {
  label?: string;
  /** Pick whichever contrasts with the surrounding card's surface colour. */
  background?: PlaceholderBackground;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        backgrounds[background],
        className,
      )}
      aria-hidden
    >
      {label && (
        <span className="px-4 text-center text-12med uppercase tracking-wide text-navy/50">
          {label}
        </span>
      )}
    </div>
  );
}
