import { Link } from "@/i18n/navigation";
import CartIcon from "@/components/shared/icons/CartIcon";

/**
 * Cart entry point. Links to the single-page checkout. `count` drives the
 * badge — wired to the cart store in a later step (0 for now).
 */
export default function CartButton({
  label,
  count = 0,
}: {
  label: string;
  count?: number;
}) {
  return (
    <Link
      href="/checkout"
      aria-label={label}
      className="relative flex size-11 items-center justify-center rounded-full text-navy transition-colors duration-300 hover:text-red focus-visible:text-red"
    >
      <CartIcon className="size-6" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-red px-1 text-10med text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
