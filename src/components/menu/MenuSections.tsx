import DishesGrid from "@/components/menu/DishesGrid";
import { MENU_SECTION_ATTR, SPECIAL_OFFERS_SLUG } from "@/constants/menu";
import { getCategories, getCategoryBySlug } from "@/data/menu";
import type { Locale } from "@/i18n/routing";
import type { Dish } from "@/types/content";

type Group = {
  slug: string;
  name: string;
  description?: string | null;
  dishes: Dish[];
};

/**
 * The whole catalog, grouped under category headings.
 *
 * Every URL serves the same list, but the one you arrived on leads: its
 * category is hoisted to the front and gets the `<h1>` and its description
 * from Sanity. That is what keeps `/menu/desserts` a page about desserts for a
 * crawler while giving the reader one continuous catalog they can keep
 * scrolling through — the chip strip follows it, and swaps the URL as they go.
 */
export default async function MenuSections({
  dishes,
  promotions,
  entrySlug,
  specialOffersLabel,
  emptyLabel,
  emptyFilterLabel,
  locale,
}: {
  dishes: Dish[];
  promotions: Dish[];
  /** Category the visitor landed on, or `"all"` for the full catalog. */
  entrySlug: string;
  specialOffersLabel: string;
  emptyLabel: string;
  emptyFilterLabel: string;
  locale: Locale;
}) {
  const categories = await getCategories(locale);

  const groups: Group[] = categories
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      dishes: dishes.filter((dish) => dish.categorySlug === category.slug),
    }))
    .filter((group) => group.dishes.length > 0);

  if (promotions.length > 0) {
    groups.push({
      slug: SPECIAL_OFFERS_SLUG,
      name: specialOffersLabel,
      dishes: promotions,
    });
  }

  // Only the entry category needs its prose — one extra query rather than
  // seven, and `/menu` needs none at all.
  const entry =
    entrySlug === "all" ? null : await getCategoryBySlug(entrySlug, locale);
  const lead = groups.find((group) => group.slug === entrySlug);
  if (lead && entry?.description) lead.description = entry.description;

  const ordered = lead
    ? [lead, ...groups.filter((group) => group !== lead)]
    : groups;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {ordered.map((group) => {
        const isLead = group === lead;
        const Heading = isLead ? "h1" : "h2";

        return (
          <section
            key={group.slug}
            {...{ [MENU_SECTION_ATTR]: group.slug }}
            id={`category-${group.slug}`}
            aria-labelledby={`category-${group.slug}-title`}
            className="scroll-mt-[calc(var(--header-height)+4.5rem)]"
          >
            <Heading
              id={`category-${group.slug}-title`}
              className="font-findsans text-20bold uppercase text-navy md:text-24bold xl:text-28bold"
            >
              {group.name}
            </Heading>

            {isLead && group.description ? (
              <p className="mt-3 max-w-[680px] text-14reg leading-relaxed text-graphite md:text-16reg">
                {group.description}
              </p>
            ) : null}

            <div className="mt-5 md:mt-6">
              <DishesGrid
                dishes={group.dishes}
                emptyLabel={emptyLabel}
                emptyFilterLabel={emptyFilterLabel}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
