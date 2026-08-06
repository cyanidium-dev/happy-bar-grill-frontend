import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

/**
 * Brand mark — the ribbon-backed "Happy Bar Grill" wordmark. Two fixed-art
 * SVGs (not one asset scaled by CSS): mobile/desktop have different aspect
 * ratios, not just different sizes, so both render and Tailwind toggles
 * which is visible per breakpoint.
 *
 * `className` controls the rendered height (e.g. `h-8 md:h-10`) — width
 * follows automatically from each SVG's own aspect ratio.
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
      aria-label="Happy Bar & Grill Paradise"
      className={cn(
        "inline-flex w-fit shrink-0 items-center outline-none",
        className,
      )}
    >
      <Image
        src="/images/header/logo-mob.svg"
        alt=""
        width={74}
        height={66}
        className="h-full w-auto lg:hidden"
        priority
      />
      <Image
        src="/images/header/logo-desk.svg"
        alt=""
        width={144}
        height={98}
        className="hidden h-full w-auto lg:block"
        priority
      />
    </Link>
  );
}
