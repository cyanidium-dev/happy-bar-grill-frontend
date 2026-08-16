import { getLocale, getTranslations } from "next-intl/server";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { MENU_CATALOG_ID } from "@/constants/menu";
import { getAllDishes, getPromotions } from "@/data/menu";
import type { Locale } from "@/i18n/routing";
import CategoryNav from "./CategoryNav";
import MenuCatalog from "./MenuCatalog";
import MenuDecorations from "./MenuDecorations";
import MenuScrollSpyProvider from "./menuScrollSpy";
import MenuSections from "./MenuSections";

/**
 * The menu body, identical on `/menu` and on every `/menu/[category]`.
 *
 * There is one catalog and one behaviour. The route only decides which
 * category leads — it is hoisted to the front and carries the `<h1>` — so a
 * category URL still reads as a page about that category, while the visitor
 * gets a list they can keep scrolling through. The chip strip follows along
 * and rewrites the URL as they pass each one.
 */
export default async function MenuView({ activeSlug }: { activeSlug: string }) {
  const t = await getTranslations("Menu");
  const locale = (await getLocale()) as Locale;

  const [dishes, promotions] = await Promise.all([
    getAllDishes(locale),
    getPromotions(locale),
  ]);

  return (
    <section
      id={MENU_CATALOG_ID}
      className="relative overflow-x-clip bg-white scroll-mt-[var(--header-height)]"
    >
      <MenuScrollSpyProvider entrySlug={activeSlug}>
        <MenuCatalog
          dishes={dishes}
          mobileNav={<CategoryNav activeSlug={activeSlug} variant="mobile" />}
          desktopNav={<CategoryNav activeSlug={activeSlug} variant="desktop" />}
          decorations={<MenuDecorations />}
        >
          <MenuSections
            dishes={dishes}
            promotions={promotions}
            entrySlug={activeSlug}
            specialOffersLabel={t("specialOffers")}
            emptyLabel={t("emptyCategory")}
            emptyFilterLabel={t("priceFilter.empty")}
            locale={locale}
          />
        </MenuCatalog>
      </MenuScrollSpyProvider>
      <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
    </section>
  );
}
