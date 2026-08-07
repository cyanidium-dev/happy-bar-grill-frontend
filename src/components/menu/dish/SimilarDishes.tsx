import { getTranslations } from "next-intl/server";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DishesGrid from "@/components/menu/DishesGrid";
import type { Dish } from "@/types/content";

/**
 * "Similar dishes" block on a dish page — same-category suggestions (topped up
 * from popular dishes when a category is thin). Renders nothing when empty.
 */
export default async function SimilarDishes({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) return null;

  const t = await getTranslations("DishPage");

  return (
    <Section background="beige" accent="warm" waveTop="white">
      <AnimatedWrapper animation={{ y: 20 }}>
        <SectionTitle className="mb-8 md:mb-10">{t("similarTitle")}</SectionTitle>
      </AnimatedWrapper>
      <DishesGrid dishes={dishes} emptyLabel="" />
    </Section>
  );
}
