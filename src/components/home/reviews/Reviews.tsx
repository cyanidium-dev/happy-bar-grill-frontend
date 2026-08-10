import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import { Sheen } from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import ReviewCard from "./ReviewCard";
import Image from "next/image";
import { reviews } from "@/data/home";
import { REVIEWS_URL } from "@/constants/contacts";

/**
 * Block 5 — reviews. Short, real testimonials with a link out to Google Maps to
 * remove doubt before ordering.
 */
export default async function Reviews() {
  const t = await getTranslations("HomePage.reviews");

  return (
    <Section className="relative" waveTop="white" containerClassName="static">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/reviews/bg-image.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="relative z-[1] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <AnimatedWrapper className="flex max-w-2xl flex-col gap-3 text-white">
          <SectionTitle variant="white">{t("title")}</SectionTitle>
          <p className="max-w-[399px]text-16reg text-white">{t("text")}</p>
        </AnimatedWrapper>
        <AnimatedWrapper animation={{ y: 20 }} className="shrink-0">
          {/*
            External Google Maps URL — raw <a> with primary pill styles
            (same look as Button; can't use localized <Link>).
          */}
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-red px-6 py-3.5 text-center text-16semi text-white transition duration-300 ease-out focus-visible:outline-none xl:hover:bg-red-dark"
          >
            <Sheen />
            <span className="relative z-[1]">{t("cta")}</span>
          </a>
        </AnimatedWrapper>
      </div>

      <ul className="relative z-[1] mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
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
