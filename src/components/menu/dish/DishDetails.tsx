import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Badge from "@/components/shared/badges/Badge";
import DishQuantityAdd from "./DishQuantityAdd";
import type { Dish } from "@/types/content";

/**
 * Right-hand info panel on a dish page: name, description, tag, price/weight
 * and the quantity + add-to-cart control.
 */
export default async function DishDetails({ dish }: { dish: Dish }) {
  const [t, tp] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Product"),
  ]);

  return (
    <div className="relative flex h-full flex-col justify-between gap-5">
      <div className="pointer-events-none absolute hidden lg:block  lg:bottom-[-120px] lg:right-[-391px] xl:right-[-321px] w-[500px] h-[333px]">
        <Image
          src="/images/home/categories/bg-image.webp"
          alt={t("alts.bgImage")}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-3">
        {dish.tag && (
          <Badge variant={dish.tag} className="self-start">
            {tp(`tags.${dish.tag}`)}
          </Badge>
        )}

        <h1 className="text-28bold text-navy sm:text-32bold xl:mb-6">
          {dish.name}
        </h1>

        {dish.description ? (
          <p className="text-16reg leading-relaxed text-graphite">
            {dish.description}
          </p>
        ) : null}
      </div>

      <div className="relative flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-24bold text-navy">
            {dish.price} {tp("currency")}
          </span>
          {dish.oldPrice ? (
            <span className="text-18med text-grey-dark line-through">
              {dish.oldPrice} {tp("currency")}
            </span>
          ) : null}
          <span className="text-14med text-grey-dark">
            {dish.weight} {tp("weightUnit")}
          </span>
        </div>

        <div className="mt-1">
          <DishQuantityAdd
            line={{
              id: dish.slug,
              name: dish.name,
              price: dish.price,
              image: dish.image,
              imageAlt: dish.name,
              weight: dish.weight,
            }}
            labels={{
              addToCart: tp("addToCart"),
              decrease: t("quantityDecrease"),
              increase: t("quantityIncrease"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
