import { getTranslations } from "next-intl/server";
import Section from "@/components/shared/Section";
import CategoryNav from "./CategoryNav";
import DishesGrid from "./DishesGrid";
import { getAllDishes, getDishesByCategory } from "@/data/menu";

/**
 * Shared menu body used by both `/menu` (activeSlug="all") and
 * `/menu/[category]`: category navigation + the dishes grid. Category chips
 * sit on top below xl and become a sticky sidebar from xl.
 */
export default async function MenuView({ activeSlug }: { activeSlug: string }) {
  const t = await getTranslations("Menu");
  const dishes =
    activeSlug === "all" ? getAllDishes() : getDishesByCategory(activeSlug);

  return (
    <Section background="white" containerClassName="pt-14 lg:pt-14 xl:pt-14">
      <CategoryNav activeSlug={activeSlug} variant="mobile" />

      <div className="mt-6 flex flex-col gap-8 xl:mt-8 xl:flex-row xl:items-start xl:gap-10">
        <CategoryNav activeSlug={activeSlug} variant="desktop" />
        <div className="min-w-0 flex-1">
          <DishesGrid dishes={dishes} emptyLabel={t("emptyCategory")} />
        </div>
      </div>
    </Section>
  );
}
