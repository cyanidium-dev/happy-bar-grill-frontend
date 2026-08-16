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
  fresh: (
    <svg {...iconProps} className="size-6">
      <path d="M11 20a7 7 0 0 1-7-7c0-4 3-8 7-9 4 1 7 5 7 9a7 7 0 0 1-7 7Z" />
      <path d="M11 20V9" />
    </svg>
  ),
  portions: (
    <svg {...iconProps} className="size-6">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  variety: (
    <svg {...iconProps} className="size-6">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  atmosphere: (
    <svg {...iconProps} className="size-6">
      <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" />
    </svg>
  ),
};

const keys = ["fresh", "portions", "variety", "atmosphere"] as const;

/** Brand values framed as promises (a new venue — principles, not achievements). */
export default async function AboutValues() {
  const t = await getTranslations("AboutPage.values");
  const decorFade = fadeIn(delayAfterCards(keys.length, { stagger: 0.06 }));

  return (
    <Section
      background="white"
      className="z-15"
      containerClassName="pt-[72px] md:pt-[88px] xl:pt-[120px]"
    >
      <AnimatedWrapper
        className="pointer-events-none absolute hidden md:bottom-[-220px] md:right-[-150px] md:block md:h-[458px] md:w-[535px] lg:right-[-100px] lg:bottom-[-240px] xl:bottom-[-240px] xl:right-[-150px] lg:h-[458px] lg:w-[535px]"
        animation={decorFade}
        amount={0.01}
        parallax={18}
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
        parallax={-12}
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
        parallax={24}
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
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle className="max-w-[360px] md:max-w-none">
            {t("title")}
          </SectionTitle>
          <p className="max-w-[280px] text-16reg text-graphite">{t("text")}</p>
        </AnimatedWrapper>

        <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {keys.map((key, index) => (
            <AnimatedWrapper
              key={key}
              as="li"
              animation={{ y: 24, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="flex h-full flex-col gap-3 rounded-tl-2xl rounded-br-2xl bg-beige p-6 shadow-card">
                <span className="flex size-12 items-center justify-center rounded-tl-lg rounded-br-lg bg-red/10 text-red">
                  {icons[key]}
                </span>
                <h3 className="text-18semi text-navy">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-14reg leading-relaxed text-graphite">
                  {t(`items.${key}.text`)}
                </p>
              </div>
            </AnimatedWrapper>
          ))}
        </ul>
      </div>
    </Section>
  );
}
