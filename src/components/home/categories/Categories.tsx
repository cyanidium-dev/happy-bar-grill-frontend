import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import CategoryCard from "./CategoryCard";
import Image from "next/image";
import { getCategories } from "@/data/menu";

/**
 * Block 2 — menu categories. Large visual tiles let the user jump straight to
 * the food type they want.
 */
export default async function Categories() {
  const t = await getTranslations("HomePage.categories");
  const categories = await getCategories();

  return (
    <Section background="white" className="pt-15 md:pt-0">
      <div className="flex flex-col gap-10">
        <div className="absolute left-0 top-[-40px] md:top-[40px] xl:top-[80px] w-[275px] h-[187px]">
          <Image
            src="/images/home/categories/fork.webp"
            alt={t("alts.fork")}
            fill
            sizes="275px"
            className="object-cover"
          />
          <div className="absolute left-[-170px] w-[204px] h-[140px] rounded-full bg-white blur-[10px]" />
        </div>

        <AnimatedWrapper>
          <SectionTitle className="md:ml-[220px] lg:ml-[160px] xl:ml-[175px]">
            {t("title")}
          </SectionTitle>
        </AnimatedWrapper>

        <div className="hidden xl:block absolute lg:top-[141px] xl:top-[180px] right-20 lg:w-[129px] xl:w-[149px] h-[3px] bg-gradient-to-r from-navy-dark to-white rounded-full" />

        <div className="absolute right-[-155px] xs:right-[-210px] md:right-[-250px] lg:right-[-30px] xl:right-[-201px] bottom-28 xs:bottom-12 sm:bottom-8 md:bottom-[-40px] lg:bottom-10 xl:bottom-[-40px] w-[350px] h-[233px] xs:w-[450px] xs:h-[300px] sm:w-[515px] sm:h-[343px] md:w-[715px] md:h-[484px] lg:w-[615px] lg:h-[410px] xl:w-[715px] xl:h-[484px]">
          <Image
            src="/images/home/categories/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
            sizes="(max-width: 640px) 515px, 715px"
            className="object-cover"
          />
        </div>
        <ul className="mt-3.4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
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
        <p className="max-w-[260px] lg:max-w-[344px] xl:max-w-[454px] text-14reg lg:text-16reg text-graphite">
          {t("text")}
        </p>
      </div>
    </Section>
  );
}
