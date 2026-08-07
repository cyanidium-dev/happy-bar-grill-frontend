import { getTranslations } from "next-intl/server";
import Container from "@/components/shared/container/Container";
import CategoryNav from "./CategoryNav";
import DishesGrid from "./DishesGrid";
import MenuDecorations from "./MenuDecorations";
import { getAllDishes, getDishesByCategory } from "@/data/menu";

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
    <section className="relative overflow-x-clip bg-white">
      <div className="pt-14 xl:hidden">
        <CategoryNav activeSlug={activeSlug} variant="mobile" />
      </div>

      <Container className="relative flex flex-col gap-8 pb-12 pt-6 md:pb-16 xl:flex-row xl:items-start xl:gap-10 xl:pb-24 xl:pt-14">
        <MenuDecorations />
        <CategoryNav activeSlug={activeSlug} variant="desktop" />
        <div className="relative z-10 min-w-0 flex-1">
          <DishesGrid dishes={dishes} emptyLabel={t("emptyCategory")} />
        </div>
      </Container>
    </section>
  );
}
