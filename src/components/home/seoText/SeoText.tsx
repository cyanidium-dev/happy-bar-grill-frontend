import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DecorativeEllipsis from "@/components/shared/DecorativeEllipsis";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import Image from "next/image";

/**
 * Bottom-of-page SEO paragraph. Muted, lower visual weight — describes the full
 * offering for search engines while staying readable for users.
 */
export default async function SeoText() {
  const t = await getTranslations("HomePage.seo");

  return (
    <Section
      background="white"
      className="pt-[82px] pb-[228px] -top-18"
      sectionAside={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/home/seo-text/bg-image.webp"
            alt={t("alts.bgImage")}
            fill
            className="object-cover -scale-x-100"
          />
        </div>
      }
      containerClassName="pb-9 pt-20 md:pb-11 md:pt-24 xl:pb-12 xl:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 right-0 md:top-50 xl:top-50 md:left-80 lg:left-120 xl:left-160 z-1 h-[85px] w-[110px]"
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
        className="pointer-events-none absolute z-1 -top-12 right-10 md:-top-4 xl:top-10 md:left-50 lg:left-80 xl:left-110 z-10 h-[229px] w-[213px]"
      >
        <Image
          src="/images/home/seo-text/onion-large.webp"
          alt={t("alts.onionLarge")}
          fill
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute z-1 -bottom-80 md:-bottom-65 left-8 xs:left-20 md:left-60 xl:left-100 z-10 w-[800px] h-[301px]"
      >
        <Image
          src="/images/home/seo-text/grill-plate.webp"
          alt={t("alts.grillPlate")}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-8">
        <AnimatedWrapper className="flex flex-col gap-4 text-14reg text-grey-dark xl:text-16reg text-white">
          <div className="flex flex-col gap-6 md:flex-row lg:gap-[100px] xl:gap-[260px] md:justify-between">
            {" "}
            <div className="flex shrink-0 flex-col gap-4">
              <SectionTitle className="text-white">{t("title")}</SectionTitle>
              <DecorativeEllipsis />
            </div>
            <p className="md:max-w-[300px] lg:max-w-[340px] xl:max-w-[430px]">
              {t("paragraph1")}
            </p>
          </div>
          <div className="flex flex-col gap-6 md:flex-row lg:gap-[100px] xl:gap-[260px] md:justify-between">
            <p className="md:max-w-[300px] lg:max-w-[340px]  xl:max-w-[430px]">
              {t("paragraph2")}
            </p>
            <p className="md:max-w-[300px] lg:max-w-[340px] xl:max-w-[430px]">
              {t("paragraph3")}
            </p>
          </div>
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
