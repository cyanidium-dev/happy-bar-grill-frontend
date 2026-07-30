import Image from "next/image";
import { cn } from "@/utils/cn";

type CardMediaProps = {
  src: string;
  alt: string;
  /** Aspect-ratio / sizing overrides, e.g. "aspect-square". */
  className?: string;
  /** Responsive `sizes` hint for the optimizer; tune per grid. */
  sizes?: string;
  priority?: boolean;
};

/**
 * Fixed-ratio image for cards. When placed inside an `interactive` Card
 * (a `group`), it zooms slightly on desktop hover. Uses `fill`, so the wrapper
 * owns the dimensions.
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
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden", className)}>
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
