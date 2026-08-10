import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
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

  return (
    <Section background="beige" waveTop="white" className="rounded-b-[24px] lg:rounded-b-[36px]">
      <div className="flex flex-col gap-8">
        <AnimatedWrapper>
          <SectionTitle>{t("title")}</SectionTitle>
        </AnimatedWrapper>

        <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {keys.map((key, index) => (
            <AnimatedWrapper
              key={key}
              as="li"
              animation={{ y: 24, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="flex h-full flex-col gap-3 rounded-tl-2xl rounded-br-2xl bg-white p-6 shadow-card">
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
