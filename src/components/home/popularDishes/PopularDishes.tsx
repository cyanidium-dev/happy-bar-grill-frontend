import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import { getPopularDishes } from "@/data/menu";

/**
 * Block 4 — popular dishes. Bestseller-tagged items with price, weight and
 * quick add-to-cart, to shorten the choice for undecided users.
 */
export default async function PopularDishes() {
  const t = await getTranslations("HomePage.popular");
  const popularDishes = await getPopularDishes();

  return (
    <Section background="white" waveFlip>
      <AnimatedWrapper className="flex flex-col gap-3">
        <SectionTitle>{t("title")}</SectionTitle>
        <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
      </AnimatedWrapper>

      <ul className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {popularDishes.map((dish, index) => (
          <AnimatedWrapper
            key={dish.slug}
            as="li"
            animation={{ y: 24, delay: (index % 4) * 0.08 }}
            className="h-full"
          >
            <DishCard dish={dish} />
          </AnimatedWrapper>
        ))}
      </ul>

      <AnimatedWrapper className="mt-8 flex justify-center md:mt-10">
        <Button href="/menu" size="lg">
          {t("cta")}
        </Button>
      </AnimatedWrapper>
    </Section>
  );
}
