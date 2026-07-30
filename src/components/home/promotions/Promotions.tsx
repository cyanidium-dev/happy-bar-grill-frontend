import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import { promotions } from "@/data/home";

/**
 * Block 3 — promotions. A few current deals to show value and nudge the order.
 * (Managed via the admin panel / CMS later.)
 */
export default async function Promotions() {
  const t = await getTranslations("HomePage.promotions");

  return (
    <Section background="beige">
      <AnimatedWrapper className="flex flex-col gap-2">
        <SectionTitle>{t("title")}</SectionTitle>
        <p className="text-16reg text-graphite">{t("subtitle")}</p>
      </AnimatedWrapper>

      <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {promotions.map((dish, index) => (
          <AnimatedWrapper
            key={dish.slug}
            as="li"
            animation={{ y: 24, delay: index * 0.08 }}
            className="h-full"
          >
            <DishCard dish={dish} />
          </AnimatedWrapper>
        ))}
      </ul>
    </Section>
  );
}
