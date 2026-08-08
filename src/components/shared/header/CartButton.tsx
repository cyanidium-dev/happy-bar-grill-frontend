import { Link } from "@/i18n/navigation";
import CartIcon from "@/components/shared/icons/CartIcon";
import { CART_FLY_TARGET_ID } from "@/lib/cartFly";
import { cn } from "@/utils/cn";

/**
 * Cart entry point. Links to the single-page checkout. `count` drives the
 * badge — wired to the cart store in a later step (0 for now).
 */
export default function CartButton({
  label,
  count = 0,
  className,
}: {
  label: string;
  count?: number;
  className?: string;
}) {
  return (
    <Link
      href="/checkout"
      id={CART_FLY_TARGET_ID}
      aria-label={label}
      className={cn(
        "relative flex size-8 lg:size-[41px] items-center justify-center rounded-full bg-red transition-colors duration-300 hover:text-red focus-visible:text-red",
        className,
      )}
    >
      <CartIcon className="size-4.5 lg:size-6 text-white" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-red px-1 text-10med text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
