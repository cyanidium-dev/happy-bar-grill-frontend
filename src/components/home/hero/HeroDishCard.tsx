import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CardMedia from "@/components/shared/cards/CardMedia";
import CartIcon from "@/components/shared/icons/CartIcon";
import QuickAddButton from "@/components/shared/cards/QuickAddButton";
import StopPropagationWrapper from "@/components/shared/cards/StopPropagationWrapper";
import type { Dish } from "@/types/content";
import { cn } from "@/utils/cn";
import { cartLineFromDish } from "@/utils/cartLine";

/**
 * Compact promo card for the Hero's "featured dishes" row — a red/navy
 * gradient tile with the photo mounted in a white frame that pokes past the
 * card's edge, matching the reference design. Deliberately lighter than the
 * full `DishCard` (no price/weight/badge): its only job here is to tease a
 * dish and push into its menu page (with a quick add-to-cart on the icon).
 */
export default async function HeroDishCard({
  dish,
  className,
}: {
  dish: Dish;
  className?: string;
}) {
  const t = await getTranslations("Product");
  const href = `/menu/${dish.categorySlug}/${dish.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-full shrink-0 gap-3 w-[279px] rounded-[14px] bg-white/10 backdrop-blur-[18px] shadow-[inset_0px_4px_12.6px_rgba(255,255,255,0.22)] p-3",
        className,
      )}
    >
      <article className="contents">
        <div className="relative w-[104px] h-[107px] shrink-0 self-center overflow-hidden rounded-[7px] bg-white">
          <CardMedia
            src={dish.image}
            alt={dish.name}
            className="h-full w-full rounded-[7px]"
            sizes="104px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 py-1">
          <div className="flex flex-col gap-2.5">
            <h3 className="line-clamp-2 font-findsans text-12bold uppercase text-white">
              {dish.name}
            </h3>
            <p className="line-clamp-4 text-8light text-white">
              {dish.description}
            </p>
          </div>

          <div className="mt-auto flex items-center gap-1.5 pt-1.5">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white w-full text-center px-3.5 h-[27px] sm:h-[27px] text-8bold uppercase tracking-wide text-navy transition-colors duration-300 xl:hover:bg-beige">
              {t("details")}
            </span>

            <StopPropagationWrapper>
              <QuickAddButton
                line={cartLineFromDish(dish)}
                label={t("addToCart")}
                variant="secondary"
                shape="pill"
                className="size-[27px] sm:size-[27px] shrink-0"
              >
                <CartIcon className="size-4" />
              </QuickAddButton>
            </StopPropagationWrapper>
          </div>
        </div>
      </article>
    </Link>
  );
}
