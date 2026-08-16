import { getTranslations } from "next-intl/server";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { MENU_CATALOG_ID } from "@/constants/menu";
import { getAllDishes, getDishesByCategory } from "@/data/menu";
import CategoryNav from "./CategoryNav";
import DishesGrid from "./DishesGrid";
import MenuCatalog from "./MenuCatalog";
import MenuCatalogScroll from "./MenuCatalogScroll";
import MenuDecorations from "./MenuDecorations";
import MenuScrollSpyProvider from "./menuScrollSpy";
import MenuSections from "./MenuSections";

/**
 * Shared menu body used by both `/menu` (activeSlug="all") and
 * `/menu/[category]`: category navigation + the dishes grid. Mobile chips
 * sit outside the container; from xl the sidebar sits in one row with the
 * dishes, top-aligned.
 */
export default async function MenuView({ activeSlug }: { activeSlug: string }) {
  const t = await getTranslations("Menu");
  const isFullCatalog = activeSlug === "all";
  const dishes = isFullCatalog
    ? await getAllDishes()
    : await getDishesByCategory(activeSlug);

  const catalog = (
    <MenuCatalog
      dishes={dishes}
      mobileNav={<CategoryNav activeSlug={activeSlug} variant="mobile" />}
      desktopNav={<CategoryNav activeSlug={activeSlug} variant="desktop" />}
      decorations={<MenuDecorations />}
    >
      {/* The full catalog reads as one continuous list broken into category
          headings, so the chips can follow the scroll. A single category is
          already its own route — a flat grid is all it needs. */}
      {isFullCatalog ? (
        <MenuSections
          dishes={dishes}
          emptyLabel={t("emptyCategory")}
          emptyFilterLabel={t("priceFilter.empty")}
        />
      ) : (
        <DishesGrid
          dishes={dishes}
          emptyLabel={t("emptyCategory")}
          emptyFilterLabel={t("priceFilter.empty")}
        />
      )}
    </MenuCatalog>
  );

  return (
    <section
      id={MENU_CATALOG_ID}
      className="relative overflow-x-clip bg-white scroll-mt-[var(--header-height)]"
    >
      <MenuCatalogScroll />
      {/* Only the full catalog has sections to spy on. Mounting the provider
          on a category route would leave it with nothing to track, and the
          chips would fall back to reporting "All dishes" as current. */}
      {isFullCatalog ? (
        <MenuScrollSpyProvider>{catalog}</MenuScrollSpyProvider>
      ) : (
        catalog
      )}
      <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
    </section>
  );
}
