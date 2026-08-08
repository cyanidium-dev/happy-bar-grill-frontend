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
  /** Horizontal sticky chips (< xl) or vertical sticky sidebar (xl+). */
  variant: "mobile" | "desktop";
};

type NavItem = { label: string; href: string; active: boolean };

const itemBase = "transition-colors duration-300 focus-visible:outline-none";
const activeCls = "bg-navy text-white";
const inactiveCls =
  "bg-white text-navy ring-1 ring-navy hover:text-red hover:ring-red transition duration-300 ease-in-out";

/**
 * Menu category navigation. Same links + active state in two layouts:
 * sticky scrollable chips on the top (< xl) and a sticky vertical sidebar
 * from xl, top-aligned with the dishes grid.
 */
export default async function CategoryNav({
  activeSlug,
  variant,
}: CategoryNavProps) {
  const t = await getTranslations("Menu");
  const categories = await getCategories();

  const items: NavItem[] = [
    { label: t("allDishes"), href: "/menu", active: activeSlug === "all" },
    {
      label: t("specialOffers"),
      href: `/menu/${SPECIAL_OFFERS_SLUG}`,
      active: activeSlug === SPECIAL_OFFERS_SLUG,
    },
    ...categories.map((category) => ({
      label: category.name,
      href: `/menu/${category.slug}`,
      active: activeSlug === category.slug,
    })),
  ];

  if (variant === "mobile") {
    return <MobileCategoryChips items={items} ariaLabel={t("categoriesLabel")} />;
  }

  const tAlts = await getTranslations("Menu.alts");

  return (
    <nav
      aria-label={t("categoriesLabel")}
      className="hidden w-72 shrink-0 self-start xl:block xl:sticky"
      style={{ top: "calc(var(--header-height) + 1.5rem)" }}
    >
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <CategoryNavLink
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                itemBase,
                "block rounded-full px-5 py-3 text-16med",
                item.active ? activeCls : inactiveCls,
              )}
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
