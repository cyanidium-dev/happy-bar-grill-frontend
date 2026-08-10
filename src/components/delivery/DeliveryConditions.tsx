import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import PhoneButton from "@/components/shared/buttons/PhoneButton";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import {
  DELIVERY_COST,
  DELIVERY_TIME,
  MIN_ORDER,
} from "@/constants/contacts";

/**
 * Delivery conditions. The venue has just opened, so exact zone/cost are
 * confirmed by the manager at checkout — we show the known placeholder figures
 * (single source of truth in `constants/contacts`, same as the home block) as
 * approximate, and never present them as a firm promise.
 */
export default async function DeliveryConditions() {
  const t = await getTranslations("DeliveryPage.conditions");

  const rows: { label: string; value: string }[] = [
    DELIVERY_TIME && { label: t("labels.time"), value: DELIVERY_TIME },
    MIN_ORDER && { label: t("labels.minOrder"), value: MIN_ORDER },
    DELIVERY_COST && { label: t("labels.cost"), value: DELIVERY_COST },
    { label: t("labels.area"), value: t("area") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Section background="navy" waveTop="beige">
      <div className="flex flex-col gap-8">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle variant="white">{t("title")}</SectionTitle>
          <p className="max-w-2xl text-16reg text-white/80">{t("lead")}</p>
        </AnimatedWrapper>

        <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
          {rows.map((row, index) => (
            <AnimatedWrapper
              key={row.label}
              as="li"
              animation={{ y: 20, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="flex h-full flex-col gap-1 rounded-tl-xl rounded-br-xl bg-white/10 p-4 sm:rounded-tl-2xl sm:rounded-br-2xl">
                <span className="text-12med uppercase tracking-wide text-white/60">
                  {row.label}
                </span>
                <span className="text-18semi text-white">{row.value}</span>
              </div>
            </AnimatedWrapper>
          ))}
        </ul>

        <AnimatedWrapper>
          <PhoneButton
            label={t("cta")}
            className="border-white bg-white text-navy xl:hover:border-white xl:hover:bg-white/90 xl:hover:text-navy transition-colors duration-300 ease-in-out"
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
