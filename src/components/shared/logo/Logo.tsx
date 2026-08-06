import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

/**
 * Text logo. "Happy" always stays red for brand recognition; "Bar & Grill"
 * is navy by default, or white via `light` (footer, on the navy background).
 */
export default function Logo({
  className,
  onClick,
  light = false,
}: {
  className?: string;
  onClick?: () => void;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Happy Bar"
      className={cn(
        "font-findsans uppercase leading-none tracking-tight whitespace-nowrap",
        className,
      )}
    >
      <span className="text-red">Happy</span>{" "}
      <span className={light ? "text-white" : "text-navy"}>Bar</span>
    </Link>
  );
}
