import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/shared/buttons/Button";
import Badge from "@/components/shared/badges/Badge";
import Card from "@/components/shared/cards/Card";
import ImagePlaceholder from "@/components/shared/media/ImagePlaceholder";
import PlusIcon from "@/components/shared/icons/PlusIcon";
import type { Dish } from "@/types/content";

/**
 * Menu dish card, shared by the home "Popular" and "Promotions" sections and
 * (later) the catalog. The whole card links to the dish page; the round button
 * is a quick add-to-cart (wired to the cart store in a later step).
 */
export default async function DishCard({ dish }: { dish: Dish }) {
  const t = await getTranslations("Product");
  const href = `/menu/${dish.categorySlug}/${dish.slug}`;

  return (
    <Card as="article" interactive className="flex h-full flex-col">
      <Link href={href} className="relative block">
        <ImagePlaceholder label={dish.name} className="aspect-[4/3]" />
        {dish.tag && (
          <Badge variant={dish.tag} className="absolute left-3 top-3">
            {t(`tags.${dish.tag}`)}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={href}>
          <h3 className="text-20semi text-navy transition-colors duration-300 xl:group-hover:text-red">
            {dish.name}
          </h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-14reg text-grey-dark">
          {dish.description}
        </p>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-24semi text-navy">
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
      </div>
    </Card>
  );
}
