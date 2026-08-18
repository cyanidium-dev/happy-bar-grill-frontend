import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Button from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";
import DecorativeEllipsis from "@/components/shared/DecorativeEllipsis";

/**
 * About page intro: full-bleed hero with the same background treatment as
 * the blog listing and delivery page — no inset content image.
 */
export default async function AboutIntro() {
  const t = await getTranslations("AboutPage.intro");

  return (
    <section
      className="relative flex items-end overflow-hidden rounded-b-[24px] pt-[170px] pb-20 lg:rounded-b-[36px]"
      style={{ marginTop: "calc(var(--header-height) * -1)" }}
    >
      <div className="absolute inset-0 -z-20 bg-navy-dark" />
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/reviews/bg-image.webp"
          alt={t("bgImageAlt")}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>

      <Container className="relative flex flex-col gap-4">
        <div className="absolute -z-10 bottom-[-220px] left-[-340px] lg:left-[-200px] xl:left-[-140px] w-[731px] h-[533px]">
          <Image
            src="/images/about/hero/left-image.webp"
            alt={t("leftImageAlt")}
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute rotate-3 bottom-[240px] left-[-3px] w-[657px] h-[490px] rounded-full bg-[#02060B] blur-[62px]" />
        </div>

        <div className="absolute top-[-280px] xs:top-[-160px] md:top-[-170px] right-[-240px] xs:right-[-240px] sm:right-[-120px] md:right-[-40px] lg:right-[10px] xl:right-[35px] w-[505px] h-[431px]">
          <Image
            src="/images/about/hero/right-image.webp"
            alt={t("rightImageAlt")}
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <h1 className="mb-5 font-findsans text-40bold uppercase text-white lg:text-40bold">
          {t("title")}
        </h1>
        <p className="max-w-[280px] lg:max-w-[357px] text-16reg text-white/80">
          {t("text")}
        </p>
        <div className="flex flex-col-reverse sm:flex-row-reverse sm:justify-end gap-10 sm:gap-25 md:gap-[140px] md:justify-end md:gap-[140px] lg:gap-[240px] xl:gap-[279px] mt-8">
          {" "}
          <p className="xs:ml-auto sm:ml-0 max-w-[280px] lg:max-w-[355px] text-16reg text-white/80">
            {t("text2")}
          </p>
          <div className="flex flex-col gap-9 w-fit">
            <DecorativeEllipsis />
            <Button href="/menu" variant="primary" size="lg">
              {t("cta")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
