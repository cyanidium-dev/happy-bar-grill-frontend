import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

/**
 * Brand mark — the "Vtiha" wordmark (single traced SVG, transparent
 * background). Shown in its brand red on every surface it appears on (header,
 * footer and mobile menu are all navy).
 *
 * A default height is baked in; pass `className` with a height (e.g. `h-14
 * md:h-16`) to override it — width follows the logo's aspect ratio.
 */
export default function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Vtiha"
      className={cn(
        "inline-flex h-10 w-fit shrink-0 items-center outline-none lg:h-12",
        className,
      )}
    >
      <Image
        src="/images/logo/vtiha.svg"
        alt=""
        width={169}
        height={100}
        className="h-full w-auto"
        loading="eager"
      />
    </Link>
  );
}
