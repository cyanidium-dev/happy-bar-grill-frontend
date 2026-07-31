import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import CardMedia from "@/components/shared/cards/CardMedia";
import Section from "@/components/shared/Section";

const seoImage =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

/**
 * Bottom-of-page SEO paragraph. Muted, lower visual weight — describes the full
 * offering for search engines while staying readable for users. A photo sits
 * beside the text on desktop (grid places it in the 2nd column) and below it
 * on mobile (same DOM order, stacked via `flex-col`) — no reordering needed.
 */
export default async function SeoText() {
  const t = await getTranslations("HomePage.seo");

  return (
    <Section
      background="white"
      waveTop="beige"
      containerClassName="pb-9 pt-20 md:pb-11 md:pt-24 xl:pb-12 xl:pt-28"
    >
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-[6.25rem]">
        <AnimatedWrapper className="flex flex-col gap-4 text-14reg text-grey-dark xl:text-16reg">
          <p>{t("paragraph1")}</p>
          <p>{t("paragraph2")}</p>
          <p>{t("paragraph3")}</p>
        </AnimatedWrapper>

        <AnimatedWrapper animation={{ x: 30 }}>
          <CardMedia
            src={seoImage}
            alt={t("imageAlt")}
            className="aspect-[4/3] rounded-tl-2xl rounded-br-2xl shadow-card md:aspect-[3/2]"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
