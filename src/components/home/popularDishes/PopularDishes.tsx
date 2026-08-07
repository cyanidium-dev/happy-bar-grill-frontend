import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
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
      <div className="relative flex flex-col gap-3">
        <AnimatedWrapper className="flex flex-col gap-3 pr-24 sm:pr-28">
          <SectionTitle>{t("title")}</SectionTitle>
          <p className="max-w-[220px] xs:max-w-[360px] text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>

        <div className="mt-8 md:mt-10">
          <SwiperWrapper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            buttonsClassName="absolute right-0 top-32 xs:top-20 sm:top-14 xl:top-12"
            prevLabel={tSlider("prev")}
            nextLabel={tSlider("next")}
            slides={popularDishes.map((dish) => (
              <DishCard key={dish.slug} dish={dish} />
            ))}
          />
        </div>
      </div>

      <AnimatedWrapper className="mt-8 flex justify-center md:mt-10">
        <Button href="/menu" size="lg">
          {t("cta")}
        </Button>
      </AnimatedWrapper>
    </Section>
  );
}
