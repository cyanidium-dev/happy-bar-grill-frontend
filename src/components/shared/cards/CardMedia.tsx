import Image from "next/image";
import { cn } from "@/utils/cn";

type CardMediaProps = {
  src: string;
  alt: string;
  /**
   * Sizing is entirely up to the caller (e.g. `aspect-[4/3]` or `h-full`) —
   * `cn` doesn't dedupe Tailwind classes, so don't rely on a built-in default.
   */
  className: string;
  /** Responsive `sizes` hint for the optimizer; tune per grid. */
  sizes?: string;
  priority?: boolean;
};

/**
 * Image for cards/hero blocks. When placed inside an `interactive` Card (a
 * `group`), it zooms slightly on desktop hover. Uses `fill`, so the wrapper
 * (`className`) must define the box: an aspect ratio or `h-full`/`w-full`
 * inside an already-sized parent.
 *
 * Note: remote CMS image hosts must be whitelisted in `next.config.ts`
 * (`images.remotePatterns`) before using absolute URLs here.
 */
export default function CardMedia({
  src,
  alt,
  className,
  sizes = "(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority = false,
}: CardMediaProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out xl:group-hover:scale-105"
      />
    </div>
  );
}
