import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SPECIAL_OFFERS_SLUG } from "@/constants/menu";
import { getCategories } from "@/data/menu";
import { cn } from "@/utils/cn";
import CategoryNavLink from "@/components/menu/CategoryNavLink";
import MobileCategoryChips from "@/components/menu/MobileCategoryChips";

type CategoryNavProps = {
  /** Active category slug, or "all" for the full catalog (`/menu`). */
  activeSlug: string;
  /** Horizontal sticky chips (< xl) or vertical list in the sidebar (xl+). */
  variant: "mobile" | "desktop";
};

export type NavItem = {
  label: string;
  href: string;
  slug: string;
  active: boolean;
};

const itemBase =
  "relative overflow-hidden transition-colors duration-500 ease-out focus-visible:outline-none";
const activeCls = "bg-navy text-white";
const inactiveCls =
  "bg-white text-navy ring-1 ring-navy hover:text-red hover:ring-red transition duration-300 ease-in-out";

/**
 * Menu category navigation. Same links + active state in two layouts:
 * sticky scrollable chips on the top (< xl) and a vertical list from xl,
 * sitting in the sticky sidebar next to the price filter (`MenuCatalog`).
 */
export default async function CategoryNav({
  activeSlug,
  variant,
}: CategoryNavProps) {
  const t = await getTranslations("Menu");
  const categories = await getCategories();

  const items: NavItem[] = [
    {
      label: t("allDishes"),
      href: "/menu",
      slug: "all",
      active: activeSlug === "all",
    },
    ...categories.map((category) => ({
      label: category.name,
      href: `/menu/${category.slug}`,
      slug: category.slug,
      active: activeSlug === category.slug,
    })),
    /**
     * Last, after the real categories. This is a view over dishes tagged
     * `discount` rather than a category of its own, so it has no section in the
     * catalog and stays a route link — sitting second in the strip it read as a
     * peer of the real categories and broke the run the scroll-spy walks
     * through.
     */
    {
      label: t("specialOffers"),
      href: `/menu/${SPECIAL_OFFERS_SLUG}`,
      slug: SPECIAL_OFFERS_SLUG,
      active: activeSlug === SPECIAL_OFFERS_SLUG,
    },
  ];

  if (variant === "mobile") {
    return (
      <MobileCategoryChips items={items} ariaLabel={t("categoriesLabel")} />
    );
  }

  const tAlts = await getTranslations("Menu.alts");

  return (
    <nav aria-label={t("categoriesLabel")} className="hidden xl:block">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <CategoryNavLink
              href={item.href}
              slug={item.slug}
              routeActive={item.active}
              className={cn(
                itemBase,
                "block rounded-full px-5 py-3 text-16med",
              )}
              activeClassName={activeCls}
              inactiveClassName={inactiveCls}
            >
              {item.label}
            </CategoryNavLink>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none relative mt-8 h-[140px] w-[210px] -translate-x-6">
        <Image
          src="/images/home/promotions/tomato-bottom.webp"
          alt={tAlts("tomatoBottom")}
          fill
          className="object-contain object-left"
          sizes="210px"
        />
      </div>
    </nav>
  );
}
