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
    <Section background="beige" waveTop="white" clearFooterWave>
      <div className="flex flex-col gap-8">
        <div className="hidden lg:block absolute lg:left-0 lg:top-[40px] xl:top-[80px] w-[275px] h-[187px]">
          <Image
            src="/images/home/categories/fork.webp"
            alt={t("alts.fork")}
            fill
            className="object-cover"
          />
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

        <div className="hidden lg:block absolute lg:right-[-110px] xl:right-[-201px] lg:bottom-[-40px] w-[715px] h-[484px]">
          <Image
            src="/images/home/categories/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
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
