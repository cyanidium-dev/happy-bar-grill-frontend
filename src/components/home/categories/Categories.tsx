import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import CategoryCard from "./CategoryCard";
import { categories } from "@/data/home";

/**
 * Block 2 — menu categories. Large visual tiles let the user jump straight to
 * the food type they want.
 */
export default async function Categories() {
  const t = await getTranslations("HomePage.categories");

  return (
    <Section
      background="white"
      accent="coolRight"
      waveTop="beige"
    >
      <AnimatedWrapper className="flex flex-col gap-3">
        <SectionTitle>{t("title")}</SectionTitle>
        <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
      </AnimatedWrapper>

      <ul className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.slug}
            slug={category.slug}
            label={t(`items.${category.key}`)}
            image={category.image}
            delay={index * 0.06}
          />
        ))}
      </ul>
    </Section>
  );
}
