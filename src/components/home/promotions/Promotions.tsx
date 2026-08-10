import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import { SPECIAL_OFFERS_SLUG } from "@/constants/menu";
import { getPromotions } from "@/data/menu";
import Image from "next/image";

/**
 * Block 3 — promotions. Discount-tagged dishes from Sanity (`tag: discount`).
 */
export default async function Promotions() {
  const t = await getTranslations("HomePage.promotions");
  const promotions = await getPromotions();

  return (
    <Section
      background="beige"
      waveTop="white"
      waveFlip
      className="rounded-b-[24px] lg:rounded-b-[36px] overflow-hidden"
    >
      <div className="hidden lg:block absolute lg:bottom-[0px] right-0 lg:w-[390px] lg:h-[268px]">
        <Image
          src="/images/home/promotions/pizza.webp"
          alt={t("alts.pizza")}
          fill
          className="object-cover"
        />
      </div>

      <div className="hidden lg:block absolute lg:right-[320px] lg:top-[80px] w-[199px] h-[223px]">
        <Image
          src="/images/home/promotions/tomato-top.webp"
          alt={t("alts.tomatoTop")}
          fill
          className="object-cover"
        />
      </div>

      <div className="hidden lg:block absolute lg:left-[-60px] bottom-[-40px] lg:w-[261px] lg:h-[166px]">
        <Image
          src="/images/home/promotions/tomato-bottom.webp"
          alt={t("alts.tomatoBottom")}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-end">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="max-w-[540px] xl:max-w-[672px]">
            {t("title")}
          </SectionTitle>
          <p className="lg:max-w-[420px] xl:max-w-2xl text-16reg text-graphite">
            {t("text")}
          </p>
        </AnimatedWrapper>
        <AnimatedWrapper className="mt-8 flex md:mt-10">
          <Button
            href={`/menu/${SPECIAL_OFFERS_SLUG}`}
            variant="secondary"
            size="lg"
            className="max-h-[58px]"
          >
            {t("cta")}
          </Button>
        </AnimatedWrapper>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
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
