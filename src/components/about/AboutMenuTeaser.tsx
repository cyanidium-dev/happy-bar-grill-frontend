import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import CategoryCard from "@/components/home/categories/CategoryCard";
import { getCategories } from "@/data/menu";

/** The real menu breadth (categories from the CMS) with a link to the menu. */
export default async function AboutMenuTeaser() {
  const t = await getTranslations("AboutPage.menu");
  const categories = await getCategories();

  return (
    <Section background="white">
      <div className="flex flex-col gap-8">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle>{t("title")}</SectionTitle>
          <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              slug={category.slug}
              label={category.name}
              image={category.image}
              delay={index * 0.06}
            />
          ))}
        </ul>

        <AnimatedWrapper>
          <Button href="/menu" variant="primary" shape="leaf">
            {t("cta")}
          </Button>
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
