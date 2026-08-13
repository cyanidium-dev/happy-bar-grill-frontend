import { getTranslations } from "next-intl/server";
import Image from "next/image";
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
    <Section
      background="beige"
      waveTop="white"
      clearFooterWave
      className="pt-10"
    >
      <div className="flex flex-col gap-8">
        <div className="absolute left-0 top-[-40px] h-[187px] w-[275px] lg:top-[40px] xl:top-[80px]">
          <Image
            src="/images/home/categories/fork.webp"
            alt={t("alts.fork")}
            fill
            sizes="275px"
            className="object-cover"
          />
          <div className="absolute left-[-170px] w-[204px] h-[140px] rounded-full bg-beige blur-[10px]" />
        </div>

        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="lg:ml-[160px] xl:ml-[175px] lg:text-26bold xl:text-36bold">
            {t("title")}
          </SectionTitle>
          <p className="max-w-2xl text-16reg text-graphite lg:ml-[160px] xl:ml-[175px]">
            {t("text")}
          </p>
        </AnimatedWrapper>

        <div className="hidden lg:block absolute lg:top-[141px] xl:top-[180px] right-20 lg:w-[129px] xl:w-[149px] h-[3px] bg-gradient-to-r from-navy-dark to-beige rounded-full" />

        <div className="absolute bottom-28 right-[-170px] h-[233px] w-[350px] xs:bottom-12 xs:right-[-210px] xs:h-[300px] xs:w-[450px] sm:bottom-8 sm:h-[343px] sm:w-[515px] md:bottom-[-40px] md:right-[-250px] md:h-[484px] md:w-[715px] lg:right-[-110px] xl:right-[-201px]">
          <Image
            src="/images/home/categories/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
            sizes="(max-width: 640px) 515px, 715px"
            className="object-cover"
          />
        </div>

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
