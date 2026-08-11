import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import {
  delayAfterCards,
  fadeIn,
} from "@/components/shared/animatedWrappers/animation";
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
  const decorFade = fadeIn(delayAfterCards(promotions.length));

  return (
    <Section
      background="beige"
      waveTop="white"
      waveFlip
      className="rounded-b-[24px] lg:rounded-b-[36px] overflow-hidden"
    >
      <AnimatedWrapper
        className="hidden md:block absolute md:bottom-[-90px] xl:bottom-[-180px] md:right-[-150px] lg:right-[-100px] xl:right-[-150px] md:w-[535px] md:h-[458px] lg:w-[635px] lg:h-[558px] xl:w-[535px] xl:h-[458px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/promotions/pizza.webp"
          alt={t("alts.pizza")}
          fill
          className="object-cover"
        />
      </AnimatedWrapper>

      <AnimatedWrapper
        className="absolute left-[280px] md:left-auto md:right-[200px] lg:right-[320px] top-[190px] md:top-[30px] lg:top-[80px] w-[199px] h-[223px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/promotions/tomato-top.webp"
          alt={t("alts.tomatoTop")}
          fill
          className="object-cover"
        />
      </AnimatedWrapper>

      <AnimatedWrapper
        className="absolute left-[-60px] bottom-[-40px] w-[261px] h-[166px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/promotions/tomato-bottom.webp"
          alt={t("alts.tomatoBottom")}
          fill
          className="object-cover"
        />
      </AnimatedWrapper>

      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-end">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="max-w-[540px] xl:max-w-[672px]">
            {t("title")}
          </SectionTitle>
          <p className="md:max-w-[394px] lg:max-w-[420px] xl:max-w-2xl text-16reg text-graphite">
            {t("text")}
          </p>
        </AnimatedWrapper>
        <AnimatedWrapper className="mt-8 flex md:mt-10 shrink-0">
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
