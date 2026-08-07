import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/shared/buttons/Button";
import Badge from "@/components/shared/badges/Badge";
import CardMedia from "@/components/shared/cards/CardMedia";
import DishDescription from "@/components/shared/cards/DishDescription";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import type { Dish } from "@/types/content";
import { cn } from "@/utils/cn";

export type DishCardVariant = "default" | "beige";

const surfaces: Record<DishCardVariant, string> = {
  /** Frosted white — home Popular / Promotions over photo sections. */
  default: "bg-white/34",
  /** Soft beige wash — menu catalog on a white section. */
  beige: "bg-beige/80",
};

/**
 * Menu dish card, shared by the home "Popular" and "Promotions" sections and
 * the catalog. Top row: text on the left, image on the right. Bottom row:
 * price/weight and the quick add-to-cart button span the full card width under
 * the photo (wired to the cart store in a later step).
 *
 * Glass (`backdrop-blur` + translucent fill) lives on a dedicated plate, never
 * on the same node as `overflow-hidden` or a hover `transform` — that combo
 * leaves paint smudges on neighboring cards in Chrome/Safari.
 */
export default async function DishCard({
  dish,
  variant = "default",
  className,
}: {
  dish: Dish;
  /** `default` keeps the frosted white glass; `beige` is a light beige wash. */
  variant?: DishCardVariant;
  className?: string;
}) {
  const t = await getTranslations("Product");
  const href = `/menu/${dish.categorySlug}/${dish.slug}`;

  return (
    <article
      className={cn(
        "group relative h-full rounded-tl-xl rounded-br-xl shadow-card transition-[box-shadow] duration-300 ease-out sm:rounded-tl-2xl sm:rounded-br-2xl",
        "xl:hover:z-10 xl:hover:shadow-card-hover",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-[inherit] backdrop-blur-[20px]",
          surfaces[variant],
        )}
      />

      <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[inherit] p-3 sm:gap-4 sm:p-4">
        <div className="flex items-stretch gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Link href={href}>
              <h3 className="line-clamp-3 text-18semi text-navy transition-colors duration-300 xl:group-hover:text-red sm:text-20semi">
                {dish.name}
              </h3>
            </Link>
            <DishDescription
              text={dish.description}
              showMoreLabel={t("showMore")}
              showLessLabel={t("showLess")}
            />
          </div>

          <Link
            href={href}
            className="relative block aspect-[4/3] w-36 shrink-0 self-start overflow-hidden rounded-tl-xl rounded-br-xl xs:w-50 sm:w-60 md:w-42 lg:w-50 xl:w-40"
          >
            <CardMedia
              src={dish.image}
              alt={dish.name}
              className="h-full w-full"
              sizes="(max-width: 400px) 144px, (max-width: 640px) 160px, 192px"
            />
            {dish.tag && (
              <Badge variant={dish.tag} className="absolute left-2 top-2">
                {t(`tags.${dish.tag}`)}
              </Badge>
            )}
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-navy/10 pt-3">
          <div className="flex flex-col">
            <span className="flex items-baseline gap-2">
              <span className="inline-block mb-1 font-findsans text-16semi sm:text-18semi text-navy">
                {dish.price} {t("currency")}
              </span>
              {dish.oldPrice && (
                <span className="text-14med text-grey line-through">
                  {dish.oldPrice} {t("currency")}
                </span>
              )}
            </span>
            <span className="text-12med text-grey-dark">
              {dish.weight} {t("weightUnit")}
            </span>
          </div>

          <Button
            variant="primary"
            size="icon"
            shape="leaf"
            aria-label={t("addToCart")}
          >
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
