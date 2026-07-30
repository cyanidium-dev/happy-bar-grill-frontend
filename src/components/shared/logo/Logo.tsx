import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

/**
 * Text logo. Colour is inherited from `className` (navy in the header, white in
 * the footer); the "Happy" word stays red for brand recognition.
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
        "font-display uppercase leading-none tracking-tight whitespace-nowrap",
        className,
      )}
    >
      <span className="text-red">Happy</span> Bar&nbsp;&amp;&nbsp;Grill
    </Link>
  );
}
