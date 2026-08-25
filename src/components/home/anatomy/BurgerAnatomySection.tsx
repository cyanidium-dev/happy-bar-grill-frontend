import { getTranslations } from "next-intl/server";
import Image from "next/image";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import BurgerAnatomy from "@/components/home/anatomy/BurgerAnatomy";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import type {
  BurgerLabel,
  BurgerLayerId,
} from "@/components/shared/burger/BurgerSvg";

const LAYER_IDS: BurgerLayerId[] = [
  "topBun",
  "lettuce",
  "cheese",
  "patty",
  "tomato",
  "pickles",
  "bottomBun",
];

/**
 * Block 4b — burger anatomy. The one section on the page that is pure
 * interaction: hover (or scroll, on touch) pulls the burger apart to name
 * every ingredient.
 */
export default async function BurgerAnatomySection() {
  const t = await getTranslations("HomePage.anatomy");

  const labels = Object.fromEntries(
    LAYER_IDS.map((id) => [
      id,
      { name: t(`layers.${id}.name`), text: t(`layers.${id}.text`) },
    ]),
  ) as Record<BurgerLayerId, BurgerLabel>;

  return (
    <Section
      background="beige"
      className="rounded-t-[24px] lg:rounded-t-[36px] z-5 overflow-hidden"
    >
      <div className="absolute -z-10 top-60 left-60 xs:top-55 xs:left-70 sm:top-50 sm:left-90 md:left-120 md:top-14 lg:top-27 xl:top-42 lg:left-145 xl:left-210 w-[204px] h-[168px]">
        <Image
          src="/images/home/anatomy/onion.webp"
          alt={t("alts.onion")}
          fill
          sizes="204px"
          className="object-cover"
        />
      </div>
      <div className="hidden lg:block absolute -z-10 lg:top-120 xl:top-126 lg:-left-126 xl:-left-116 w-[782px] h-[769px]">
        <Image
          src="/images/home/anatomy/potato.webp"
          alt={t("alts.potato")}
          fill
          sizes="782px"
          className="object-cover"
        />
        <div className="absolute z-5 top-50 -left-50 w-full h-full rounded-full bg-beige blur-[50px]" />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="max-w-[540px]">{t("title")}</SectionTitle>
          <p className="max-w-[520px] text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>
        <AnimatedWrapper className="relative mt-8 flex shrink-0 md:mt-10 w-fit">
          <div className="absolute -z-10 -bottom-14 -right-10 w-[72px] h-[76px]">
            <Image
              src="/images/home/anatomy/decor.webp"
              alt={t("alts.decor")}
              fill
              sizes="145px"
              className="object-cover"
            />
          </div>
          <Button href="/menu" variant="secondary" size="lg">
            {t("cta")}
          </Button>
        </AnimatedWrapper>
      </div>

      <AnimatedWrapper className="mt-10 flex justify-center md:mt-14">
        <BurgerAnatomy labels={labels} hint={t("hint")} />
      </AnimatedWrapper>
    </Section>
  );
}
