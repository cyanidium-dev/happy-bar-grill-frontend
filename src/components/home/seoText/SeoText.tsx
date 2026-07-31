import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Section from "@/components/shared/Section";

/**
 * Bottom-of-page SEO paragraph. Muted, lower visual weight — describes the full
 * offering for search engines while staying readable for users.
 */
export default async function SeoText() {
  const t = await getTranslations("HomePage.seo");

  return (
    <Section
      background="white"
      waveTop="beige"
      containerClassName="pb-9 pt-20 md:pb-11 md:pt-24 xl:pb-12 xl:pt-28"
    >
      <AnimatedWrapper className="flex max-w-4xl flex-col gap-4 text-14reg text-grey-dark xl:text-16reg">
        <p>{t("paragraph1")}</p>
        <p>{t("paragraph2")}</p>
        <p>{t("paragraph3")}</p>
      </AnimatedWrapper>
    </Section>
  );
}
