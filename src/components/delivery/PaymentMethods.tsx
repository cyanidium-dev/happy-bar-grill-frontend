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
  cash: (
    <svg {...iconProps} className="size-6">
      <rect x="3" y="6.5" width="18" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6.5 9.5h.01M17.5 14.5h.01" />
    </svg>
  ),
  card: (
    <svg {...iconProps} className="size-6">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18M6.5 14.5h4" />
    </svg>
  ),
};

const keys = ["cash", "card"] as const;

/** Payment options — concrete: cash or card to the courier on delivery. */
export default async function PaymentMethods() {
  const t = await getTranslations("DeliveryPage.payment");

  return (
    <Section background="navy" waveTop="beige" clearFooterWave>
      <div className="flex flex-col gap-8">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle variant="white">{t("title")}</SectionTitle>
          <p className="max-w-2xl text-16reg text-white/80">{t("note")}</p>
        </AnimatedWrapper>

        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          {keys.map((key, index) => (
            <AnimatedWrapper
              key={key}
              as="li"
              animation={{ y: 24, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="flex h-full items-start gap-4 rounded-tl-2xl rounded-br-2xl bg-white/10 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-tl-lg rounded-br-lg bg-red/10 text-red">
                  {icons[key]}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-18semi text-white">
                    {t(`methods.${key}.title`)}
                  </h3>
                  <p className="text-14reg leading-relaxed text-white/80">
                    {t(`methods.${key}.text`)}
                  </p>
                </div>
              </div>
            </AnimatedWrapper>
          ))}
        </ul>
      </div>
    </Section>
  );
}
