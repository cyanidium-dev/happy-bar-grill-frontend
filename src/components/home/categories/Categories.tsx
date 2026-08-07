import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import CategoryCard from "./CategoryCard";
import Image from "next/image";
import { categories } from "@/data/home";

/**
 * Block 2 — menu categories. Large visual tiles let the user jump straight to
 * the food type they want.
 */
export default async function Categories() {
  const t = await getTranslations("HomePage.categories");

  return (
    <Section background="white">
      <div className="flex flex-col gap-10">
        <div className="hidden lg:block absolute lg:left-0 lg:top-[40px] xl:top-[80px] w-[275px] h-[187px]">
          <Image
            src="/images/home/categories/fork.webp"
            alt={t("alts.fork")}
            fill
            className="object-cover"
          />
        </div>

        <AnimatedWrapper>
          <SectionTitle className="lg:ml-[160px] xl:ml-[175px]">
            {t("title")}
          </SectionTitle>
        </AnimatedWrapper>

        <div className="hidden lg:block absolute lg:top-[141px] xl:top-[180px] right-20 lg:w-[129px] xl:w-[149px] h-[3px] bg-gradient-to-r from-navy-dark to-white rounded-full" />

        <div className="hidden lg:block absolute lg:right-[-110px] xl:right-[-201px] lg:bottom-[-40px] w-[715px] h-[484px]">
          <Image
            src="/images/home/categories/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
            className="object-cover"
          />
        </div>
        <ul className="mt-3.4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
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
        <p className="lg:max-w-[344px] xl:max-w-[454px] text-16reg text-graphite">
          {t("text")}
        </p>
      </div>
    </Section>
  );
}
