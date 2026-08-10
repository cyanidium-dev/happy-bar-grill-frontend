import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import Image from "next/image";
import { getPopularDishes } from "@/data/menu";

/**
 * Block 4 — popular dishes. Bestseller-tagged items with price, weight and
 * quick add-to-cart, to shorten the choice for undecided users.
 */
export default async function PopularDishes() {
  const t = await getTranslations("HomePage.popular");
  const tSlider = await getTranslations("Common.slider");
  const popularDishes = await getPopularDishes();

  return (
    <Section background="white" waveFlip>
        <div className="hidden sm:block absolute z-5 -bottom-10 -right-10 md:-bottom-4 md:-right-10 lg:-bottom-4 lg:-right-6 w-[257px] h-[259px] lg:w-[317px] lg:h-[320px]">
              <Image
                src="/images/home/popular/sushi-chopsticks.webp"
                alt="Fork"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden lg:block absolute lg:bottom-21 lg:-left-62 w-[412px] h-[205px]">
              <Image
                src="/images/home/popular/grill-plate.webp"
                alt="Fork"
                fill
                className="object-cover"
              />
            </div>
      <div className="relative flex flex-col gap-3">
        <AnimatedWrapper className="flex flex-col gap-3 pr-24 sm:pr-28">
          <div className="relative w-fit">
            <SectionTitle className="max-w-[420px] sm:max-w-full w-fit">{t("title")}</SectionTitle>
            <div className=" absolute -top-4 left-60 sm:top-auto sm:left-auto sm:bottom-6 sm:-right-12 lg:-top-14 lg:-right-14 w-[55px] h-[43px] lg:w-[85px] lg:h-[67px]">
              <Image
                src="/images/home/popular/decor.webp"
                alt="Fork"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="max-w-[220px] xs:max-w-[360px] text-16reg text-graphite">
            {t("text")}
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
            buttonsClassName="absolute right-0 -top-20 md:-top-24"
            prevLabel={tSlider("prev")}
            nextLabel={tSlider("next")}
            slides={popularDishes.map((dish) => (
              <DishCard key={dish.slug} dish={dish} />
            ))}
          />
        </AnimatedWrapper>
      </div>

      <AnimatedWrapper className="mt-8 flex md:mt-15">
        <Button href="/menu" size="lg" className="shrink-0">
          {t("cta")}
        </Button>
        <div className="relative -bottom-6.5 -left-1 bg-gradient-to-r from-red to-white h-[3px] w-full rounded-full" />
      </AnimatedWrapper>
    </Section>
  );
}
