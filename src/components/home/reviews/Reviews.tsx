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
    <Section
      waveTop="white"
      className="overflow-hidden"
      sectionAside={
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/home/reviews/bg-image.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 md:top-16 xl:top-26 left-80 xs:left-100 sm:left-120 md:left-auto md:right-40 lg:right-60 z-1 h-[164px] w-[144px]"
      >
        <Image
          src="/images/home/reviews/onion-small.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute z-1 top-48 left-50 xs:left-70 sm:left-90 md:left-auto md:top-90 xl:top-45 right-50 lg:right-70 xl:right-110 z-10 h-[229px] w-[213px]"
      >
        <Image
          src="/images/home/reviews/onion-large.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute z-1 -bottom-70 xl:-bottom-73 left-20 md:left-60 xl:left-22 z-10 w-[843px] h-[432px]"
      >
        <Image
          src="/images/home/reviews/grill-plate.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <AnimatedWrapper className="flex max-w-2xl flex-col gap-3 text-white">
          <SectionTitle variant="white" className="max-w-[300px] lg:max-w-[540px]">{t("title")}</SectionTitle>
          <p className="max-w-[312px] md:max-w-[399px] text-16reg text-white">{t("text")}</p>
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

      <ul className="relative z-10 mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
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
