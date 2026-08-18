import { getTranslations } from "next-intl/server";
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
    <Section background="white" accent={["warm", "cool"]}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="max-w-[540px]">{t("title")}</SectionTitle>
          <p className="max-w-[520px] text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>
        <AnimatedWrapper className="mt-8 flex shrink-0 md:mt-10">
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
