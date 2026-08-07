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
 *
 * `onDark`: white ribbon for dark surfaces (home hero / solid navy header).
 * Off: same geometry with an exact 4px navy-dark border on the sides and
 * bottom (no top edge), so the wordmark stays aligned with the home logo.
 */
export default function Logo({
  className,
  onClick,
  /** White ribbon for dark surfaces; bordered white ribbon on light pages. */
  onDark = true,
}: {
  className?: string;
  onClick?: () => void;
  onDark?: boolean;
}) {
  const mobSrc = onDark
    ? "/images/header/logo-mob.svg"
    : "/images/header/logo-mob-navy.svg";
  const deskSrc = onDark
    ? "/images/header/logo-desk.svg"
    : "/images/header/logo-desk-navy.svg";

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
        src={mobSrc}
        alt=""
        width={74}
        height={66}
        className="h-full w-auto lg:hidden"
        priority
      />
      <Image
        src={deskSrc}
        alt=""
        width={144}
        height={98}
        className="hidden h-full w-auto lg:block"
        priority
      />
    </Link>
  );
}
