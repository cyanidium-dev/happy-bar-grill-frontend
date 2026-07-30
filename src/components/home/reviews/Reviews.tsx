import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import ReviewCard from "./ReviewCard";
import { reviews } from "@/data/home";
import { REVIEWS_URL } from "@/constants/contacts";

/**
 * Block 5 — reviews. Short, real testimonials with a link out to Google Maps to
 * remove doubt before ordering.
 */
export default async function Reviews() {
  const t = await getTranslations("HomePage.reviews");

  return (
    <Section background="navy">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <AnimatedWrapper className="flex max-w-2xl flex-col gap-3">
          <SectionTitle variant="white">{t("title")}</SectionTitle>
          <p className="text-16reg text-white/80">{t("text")}</p>
        </AnimatedWrapper>
        <AnimatedWrapper animation={{ y: 20 }} className="shrink-0">
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-16semi text-white underline-offset-4 transition-colors hover:text-sand"
          >
            {t("cta")}
            <span aria-hidden>→</span>
          </a>
        </AnimatedWrapper>
      </div>

      <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <AnimatedWrapper
            key={review.author}
            as="li"
            animation={{ y: 24, delay: index * 0.08 }}
            className="h-full"
          >
            <ReviewCard review={review} />
          </AnimatedWrapper>
        ))}
      </ul>
    </Section>
  );
}
