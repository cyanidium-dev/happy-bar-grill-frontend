import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { ReactNode } from "react";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import {
  delayAfterCards,
  fadeIn,
} from "@/components/shared/animatedWrappers/animation";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons: Record<string, ReactNode> = {
  choose: (
    <svg {...iconProps} className="size-6">
      <path d="M4 5h2l1.2 10.5a1.5 1.5 0 0 0 1.5 1.3h7.9a1.5 1.5 0 0 0 1.5-1.2L20 8H6.2" />
      <circle cx="9.5" cy="20" r="1.1" />
      <circle cx="17" cy="20" r="1.1" />
    </svg>
  ),
  order: (
    <svg {...iconProps} className="size-6">
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  confirm: (
    <svg {...iconProps} className="size-6">
      <path d="M20 15.5v2a2 2 0 0 1-2.2 2 16 16 0 0 1-7-2.5 15.5 15.5 0 0 1-4.8-4.8 16 16 0 0 1-2.5-7A2 2 0 0 1 5.5 3h2a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1l-.9.9a12.5 12.5 0 0 0 4.8 4.8l.9-.9a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  deliver: (
    <svg {...iconProps} className="size-6">
      <path d="M3 7h9v8H3z" />
      <path d="M12 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  ),
};

const keys = ["choose", "order", "confirm", "deliver"] as const;

/** How ordering works — process steps only (correct for a venue that has just
 * opened, no invented delivery terms). */
export default async function DeliverySteps() {
  const t = await getTranslations("DeliveryPage.steps");
  const decorFade = fadeIn(delayAfterCards(keys.length, { stagger: 0.06 }));

  return (
    <Section background="white" waveTop="white" className="z-20">
      <AnimatedWrapper
        className="pointer-events-none absolute hidden md:bottom-[-220px] md:right-[-150px] md:block md:h-[458px] md:w-[535px] lg:right-[-100px] lg:bottom-[-240px] xl:bottom-[-240px] xl:right-[-150px] lg:h-[458px] lg:w-[535px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/promotions/pizza.webp"
          alt={t("alts.pizza")}
          fill
          sizes="535px"
          className="object-cover"
        />
      </AnimatedWrapper>

      <AnimatedWrapper
        className="pointer-events-none absolute top-[10px] xs:top-[50px] left-[280px] xs:left-auto xs:right-[10px] h-[223px] w-[199px] md:top-[50px] md:right-[70px] md:left-auto lg:top-[40px] lg:right-[210px]"
        animation={decorFade}
        amount={0.01}
      >
        <Image
          src="/images/home/promotions/tomato-top.webp"
          alt={t("alts.tomatoTop")}
          fill
          sizes="199px"
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
          sizes="261px"
          className="object-cover"
        />
      </AnimatedWrapper>

      <div className="relative z-10 flex flex-col gap-8">
        <AnimatedWrapper>
          <SectionTitle className="max-w-[313px] sm:max-w-full">
            {t("title")}
          </SectionTitle>
        </AnimatedWrapper>

        <ol className="grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {keys.map((key, index) => (
            <AnimatedWrapper
              key={key}
              as="li"
              animation={{ y: 24, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="flex h-full flex-col gap-3 rounded-tl-2xl rounded-br-2xl bg-beige p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-tl-lg rounded-br-lg bg-red/10 text-red">
                    {icons[key]}
                  </span>
                  <span className="font-findsans text-36bold leading-none text-navy/70">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-findsans text-18semi text-navy">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-14reg leading-relaxed text-graphite">
                  {t(`items.${key}.text`)}
                </p>
              </div>
            </AnimatedWrapper>
          ))}
        </ol>
      </div>
    </Section>
  );
}
