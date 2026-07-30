import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/shared/buttons/Button";
import Badge from "@/components/shared/badges/Badge";
import Card from "@/components/shared/cards/Card";
import CardMedia from "@/components/shared/cards/CardMedia";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import type { Dish } from "@/types/content";

/**
 * Menu dish card, shared by the home "Popular" and "Promotions" sections and
 * (later) the catalog. Top row: text on the left, image on the right. Bottom
 * row: price/weight and the quick add-to-cart button span the full card
 * width under the photo (wired to the cart store in a later step).
 */
export default async function DishCard({
  dish,
  background,
}: {
  dish: Dish;
  /** Surface colour — pick whichever contrasts with the section background. */
  background?: "beige" | "white";
}) {
  const t = await getTranslations("Product");
  const href = `/menu/${dish.categorySlug}/${dish.slug}`;

  return (
    <Card
      as="article"
      interactive
      background={background}
      className="flex h-full flex-col gap-3 p-3 sm:gap-4 sm:p-4"
    >
      <div className="flex items-stretch gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Link href={href}>
            <h3 className="line-clamp-2 text-20semi text-navy transition-colors duration-300 xl:group-hover:text-red sm:text-24semi">
              {dish.name}
            </h3>
          </Link>
          <p className="line-clamp-2 flex-1 text-14reg text-grey-dark">
            {dish.description}
          </p>
        </div>

        <Link
          href={href}
          className="relative block aspect-square w-32 shrink-0 self-start overflow-hidden rounded-lg xs:w-36 sm:w-44"
        >
          <CardMedia
            src={dish.image}
            alt={dish.name}
            className="h-full w-full"
            sizes="(max-width: 400px) 128px, (max-width: 640px) 144px, 176px"
          />
          {dish.tag && (
            <Badge variant={dish.tag} className="absolute left-2 top-2">
              {t(`tags.${dish.tag}`)}
            </Badge>
          )}
        </Link>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-20semi text-navy sm:text-24semi">
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

        <Button variant="primary" size="icon" aria-label={t("addToCart")}>
          <PlusIcon className="size-5" />
        </Button>
      </div>
    </Card>
  );
}
