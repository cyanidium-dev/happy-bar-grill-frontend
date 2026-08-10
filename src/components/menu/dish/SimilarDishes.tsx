import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DishCard from "@/components/shared/cards/DishCard";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import type { Dish } from "@/types/content";

/**
 * "Similar dishes" block on a dish page — same-category suggestions (topped up
 * from popular dishes when a category is thin). Renders nothing when empty.
 * Layout mirrors the homepage PopularDishes carousel; decorative food imagery
 * matches the former Promotions section treatment.
 */
export default async function SimilarDishes({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) return null;

  const [t, tSlider] = await Promise.all([
    getTranslations("DishPage"),
    getTranslations("Common.slider"),
  ]);

  return (
    <Section
      background="beige"
      waveTop="white"
      className="overflow-hidden rounded-b-[24px] lg:rounded-b-[36px]"
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

      <div className="relative flex flex-col gap-3">
        <AnimatedWrapper className="pr-24 sm:pr-28">
          <SectionTitle className="mb-3 max-w-[350px]">
            {t("similarTitle")}
          </SectionTitle>
        </AnimatedWrapper>

        <div className="mt-8 md:mt-10">
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
        </div>
      </div>
    </Section>
  );
}
