import { getTranslations } from "next-intl/server";
import Image from "next/image";
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
    <Section
      background="white"
      className="-top-10"
      clearFooterWave
      sectionAside={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/home/seo-text/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover -scale-x-100"
          />
        </div>
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute z-1 hidden h-[85px] w-[110px] md:top-48 md:block md:left-180 lg:left-220 lg:top-60 xl:left-260 xl:top-70"
      >
        <Image
          src="/images/home/seo-text/onion-small.webp"
          alt={t("alts.onionSmall")}
          fill
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute z-1 hidden h-[229px] w-[213px] md:left-140 md:top-18 md:block lg:left-180 lg:top-24 xl:left-220 xl:top-30"
      >
        <Image
          src="/images/home/seo-text/onion-large.webp"
          alt={t("alts.onionLarge")}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <AnimatedWrapper className="flex flex-col gap-3">
          <SectionTitle variant="white">{t("title")}</SectionTitle>
          <p className="max-w-[340px] text-16reg text-white/80">{t("note")}</p>
        </AnimatedWrapper>

        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          {keys.map((key, index) => (
            <AnimatedWrapper
              key={key}
              as="li"
              animation={{ y: 24, delay: index * 0.06 }}
              className="h-full"
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-tl-xl rounded-br-xl shadow-card sm:rounded-tl-2xl sm:rounded-br-2xl">
                {/*
                  Glass plate is a sibling of the content — never on the same
                  node as overflow-hidden — to avoid paint smudges in
                  Chrome/Safari. Parent clips to the radius.
                */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] bg-white/16 backdrop-blur-[4px]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "linear-gradient(270.67deg, rgba(242, 242, 242, 0.3) -9.58%, rgba(199, 199, 199, 0.3) 103.45%)",
                    padding: "1px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <div className="relative z-[1] flex h-full items-start gap-4 p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-tl-lg rounded-br-lg bg-sky/20 text-sky">
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
              </div>
            </AnimatedWrapper>
          ))}
        </ul>
      </div>
    </Section>
  );
}
