import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import {
  delayAfterCards,
  fadeIn,
} from "@/components/shared/animatedWrappers/animation";
import DishCard from "@/components/shared/cards/DishCard";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import type { Dish } from "@/types/content";

/**
 * "Similar dishes" block on a dish page — same-category suggestions (topped up
 * from popular dishes when a category is thin). Renders nothing when empty.
 * Layout mirrors the homepage PopularDishes carousel; decorative food imagery
 * matches AboutValues (pizza + tomatoes).
 */
export default async function SimilarDishes({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) return null;

  const [t, tSlider] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Common.slider"),
  ]);
  // Swiper row is one AnimatedWrapper — decor waits for that reveal to finish.
  const decorFade = fadeIn(delayAfterCards(1, { stagger: 0.06 }));

  return (
    <Section
      background="beige"
      waveTop="white"
      className="rounded-b-[24px] lg:rounded-b-[36px]"
    >
      <AnimatedWrapper
        className="pointer-events-none absolute hidden md:bottom-[-220px] md:right-[-150px] md:block md:h-[458px] md:w-[535px] lg:right-[-100px] lg:bottom-[-240px] xl:bottom-[-240px] xl:right-[-150px] lg:h-[458px] lg:w-[535px]"
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
        className="pointer-events-none absolute top-[0px] xs:top-[10px] left-[280px] xs:left-auto xs:right-[10px] sm:right-[90px] h-[223px] w-[199px] md:top-[50px] md:right-[130px] lg:top-[80px] lg:right-[320px]"
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
        className="pointer-events-none absolute bottom-[-40px] left-[-60px] h-[166px] w-[261px]"
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

      <div className="relative z-10 flex flex-col gap-3">
        <AnimatedWrapper className="pr-24 sm:pr-28">
          <SectionTitle className="mb-3 max-w-[350px]">
            {t("similarTitle")}
          </SectionTitle>
        </AnimatedWrapper>

        <AnimatedWrapper className="mt-8 md:mt-10">
          <SwiperWrapper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            buttonsClassName="absolute right-0 top-16 sm:top-2 lg:top-4"
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
