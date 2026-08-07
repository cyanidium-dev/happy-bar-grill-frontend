import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories } from "@/data/menu";
import { cn } from "@/utils/cn";

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
 * sticky scrollable chips on the top (mobile → below xl) and a sticky vertical
 * sidebar from xl (matching bravo's structure), styled in the project's system.
 */
export default async function CategoryNav({
  activeSlug,
  variant,
}: CategoryNavProps) {
  const t = await getTranslations("Menu");
  const tc = await getTranslations("HomePage.categories.items");
  const categories = getCategories();

  const items: NavItem[] = [
    { label: t("allDishes"), href: "/menu", active: activeSlug === "all" },
    ...categories.map((category) => ({
      label: tc(category.key),
      href: `/menu/${category.slug}`,
      active: activeSlug === category.slug,
    })),
  ];

  if (variant === "mobile") {
    return (
      <nav
        aria-label={t("categoriesLabel")}
        className="sticky z-30 -mx-6 bg-white px-6 py-3 xl:hidden"
        style={{ top: "var(--header-height)" }}
      >
        <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.href} className="shrink-0 py-0.5 px-0.5">
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  itemBase,
                  "inline-flex whitespace-nowrap rounded-full px-4 py-3 text-14med",
                  item.active ? activeCls : inactiveCls,
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label={t("categoriesLabel")}
      className="hidden w-72 shrink-0 self-start xl:block xl:sticky"
      style={{ top: "calc(var(--header-height) + 1.5rem)" }}
    >
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                itemBase,
                "block rounded-full px-5 py-3 text-16med",
                item.active ? activeCls : inactiveCls,
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
