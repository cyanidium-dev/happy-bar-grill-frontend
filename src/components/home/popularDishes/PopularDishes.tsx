import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import DishCard from "@/components/shared/cards/DishCard";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { popularDishes } from "@/data/home";

/**
 * Block 4 — popular dishes. Tagged best-sellers/new items with price, weight and
 * quick add-to-cart, to shorten the choice for undecided users.
 */
export default async function PopularDishes() {
  const t = await getTranslations("HomePage.popular");
  const tSlider = await getTranslations("Common.slider");

  return (
    <Section background="white" waveFlip>
      <div className="relative flex flex-col gap-3">
        <AnimatedWrapper className="flex flex-col gap-3 pr-24 sm:pr-28">
          <SectionTitle>{t("title")}</SectionTitle>
          <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>

        <div className="mt-8 md:mt-10">
          <SwiperWrapper
            swiperClassName="-my-2 py-2"
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            buttonsClassName="absolute right-0 top-0"
            prevLabel={tSlider("prev")}
            nextLabel={tSlider("next")}
            slides={popularDishes.map((dish, index) => (
              <AnimatedWrapper
                key={dish.slug}
                animation={{ y: 24, delay: (index % 4) * 0.08 }}
                className="h-full"
              >
                <DishCard dish={dish} />
              </AnimatedWrapper>
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
