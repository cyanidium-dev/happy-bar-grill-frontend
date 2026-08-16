import DishesGrid from "@/components/menu/DishesGrid";
import { MENU_SECTION_ATTR } from "@/constants/menu";
import { getCategories } from "@/data/menu";
import type { Dish } from "@/types/content";

/**
 * The full catalog, grouped under category headings instead of one flat grid.
 *
 * Reading straight down now walks the whole menu category by category, which
 * is what the chip strip follows — and what it scrolls to when tapped.
 * Categories with nothing in them are dropped rather than left as empty
 * headings.
 */
export default async function MenuSections({
  dishes,
  emptyLabel,
  emptyFilterLabel,
}: {
  dishes: Dish[];
  emptyLabel: string;
  emptyFilterLabel: string;
}) {
  const categories = await getCategories();

  const grouped = categories
    .map((category) => ({
      ...category,
      dishes: dishes.filter((dish) => dish.categorySlug === category.slug),
    }))
    .filter((category) => category.dishes.length > 0);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {grouped.map((category) => (
        <section
          key={category.slug}
          {...{ [MENU_SECTION_ATTR]: category.slug }}
          id={`category-${category.slug}`}
          aria-labelledby={`category-${category.slug}-title`}
          className="scroll-mt-[calc(var(--header-height)+4.5rem)]"
        >
          <h2
            id={`category-${category.slug}-title`}
            className="mb-5 font-findsans text-20bold uppercase text-navy md:mb-6 md:text-24bold xl:text-28bold"
          >
            {category.name}
          </h2>
          <DishesGrid
            dishes={category.dishes}
            emptyLabel={emptyLabel}
            emptyFilterLabel={emptyFilterLabel}
          />
        </section>
      ))}
    </div>
  );
}
