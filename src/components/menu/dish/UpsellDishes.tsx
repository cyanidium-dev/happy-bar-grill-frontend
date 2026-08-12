import { getTranslations } from "next-intl/server";
import Image from "next/image";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import {
  delayAfterCards,
  fadeIn,
} from "@/components/shared/animatedWrappers/animation";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import type { Dish } from "@/types/content";

/**
 * "Frequently bought together" on a dish page — dishes from categories flagged
 * `upsell` (Допродажі) in Sanity. Layout matches the homepage PopularDishes
 * carousel, without the "view full menu" CTA. Renders nothing when empty.
 */
export default async function UpsellDishes({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) return null;

  const [t, tSlider] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Common.slider"),
  ]);
  // Swiper row is one AnimatedWrapper — decor waits for that reveal to finish.
  const decorFade = fadeIn(delayAfterCards(1));

  return (
    <Section
      background="beige"
      className="relative z-15 rounded-t-[24px] lg:rounded-t-[36px]"
    >
      <AnimatedWrapper
        className="absolute -bottom-12 left-[-140px] lg:-bottom-11 lg:-left-52 w-[318px] h-[159px] lg:w-[412px] lg:h-[205px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/popular/grill-plate.webp"
          alt={t("alts.grillPlate")}
          fill
          className="object-cover"
        />
      </AnimatedWrapper>
      <AnimatedWrapper
        className="hidden lg:block absolute rotate-15 sm:rotate-0 z-5 -bottom-12 -right-26 sm:-right-10 md:-bottom-4 md:-right-10 lg:-bottom-28 lg:-right-6 w-[257px] h-[259px] lg:w-[317px] lg:h-[320px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/popular/sushi-chopsticks.webp"
          alt={t("alts.sushiChopsticks")}
          fill
          className="object-cover"
        />
        <div className="absolute top-[95px] right-[-140px] w-[204px] h-[160px] rounded-full bg-beige blur-[6px]" />
      </AnimatedWrapper>
      <div className="relative flex flex-col gap-3">
        <AnimatedWrapper className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-10">
          <div className="relative w-fit">
            <SectionTitle className="max-w-[230px] xs:max-w-[367px] lg:max-w-[440px] xl:max-w-[580px] shrink-0">
              {t("upsellTitle")}
            </SectionTitle>
            <div className=" absolute -top-5 left-38 xs:-top-8 xs:left-70 lg:-top-14 lg:left-78 xl:left-120 w-[55px] h-[43px] lg:w-[85px] lg:h-[67px]">
              <Image
                src="/images/home/popular/decor.webp"
                alt={t("alts.decor")}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="max-w-[220px] xs:max-w-[360px] text-16reg text-graphite">
            {t("upsellText")}
          </p>
        </AnimatedWrapper>

        <AnimatedWrapper className="relative z-10 mt-8 md:mt-10">
          <SwiperWrapper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            buttonsClassName="absolute right-0 -top-14 md:-top-13"
            prevLabel={tSlider("prev")}
            nextLabel={tSlider("next")}
            slides={dishes.map((dish) => (
              <DishCard key={`${dish.categorySlug}-${dish.slug}`} dish={dish} />
            ))}
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
