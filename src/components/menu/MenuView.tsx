import { getTranslations } from "next-intl/server";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { MENU_CATALOG_ID } from "@/constants/menu";
import { getAllDishes, getDishesByCategory } from "@/data/menu";
import CategoryNav from "./CategoryNav";
import DishesGrid from "./DishesGrid";
import MenuCatalog from "./MenuCatalog";
import MenuCatalogScroll from "./MenuCatalogScroll";
import MenuDecorations from "./MenuDecorations";

/**
 * Shared menu body used by both `/menu` (activeSlug="all") and
 * `/menu/[category]`: category navigation + the dishes grid. Mobile chips
 * sit outside the container; from xl the sidebar sits in one row with the
 * dishes, top-aligned.
 */
export default async function MenuView({ activeSlug }: { activeSlug: string }) {
  const t = await getTranslations("Menu");
  const dishes =
    activeSlug === "all"
      ? await getAllDishes()
      : await getDishesByCategory(activeSlug);

  return (
    <section
      id={MENU_CATALOG_ID}
      className="relative overflow-x-clip bg-white scroll-mt-[var(--header-height)]"
    >
      <MenuCatalogScroll />
      <MenuCatalog
        dishes={dishes}
        mobileNav={<CategoryNav activeSlug={activeSlug} variant="mobile" />}
        desktopNav={<CategoryNav activeSlug={activeSlug} variant="desktop" />}
        decorations={<MenuDecorations />}
      >
        <DishesGrid
          dishes={dishes}
          emptyLabel={t("emptyCategory")}
          emptyFilterLabel={t("priceFilter.empty")}
        />
      </MenuCatalog>
      <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
    </section>
  );
}
