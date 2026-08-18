import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Button from "@/components/shared/buttons/Button";
import PhoneButton from "@/components/shared/buttons/PhoneButton";
import Container from "@/components/shared/container/Container";

/**
 * Delivery page intro: full-bleed hero with the same background treatment as
 * the blog listing — no inset content image. CTAs go to the menu and a direct call.
 */
export default async function DeliveryHero() {
  const t = await getTranslations("DeliveryPage.hero");

  return (
    <section
      className="relative flex items-end overflow-hidden rounded-b-[24px] pt-[200px] pb-16 md:pb-24 lg:pb-40 lg:rounded-b-[36px]"
      style={{ marginTop: "calc(var(--header-height) * -1)" }}
    >
      <div className="absolute inset-0 -z-20 bg-navy-dark" />
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/reviews/bg-image.webp"
          alt={t("alts.bgImage")}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>

      <Container className="relative flex flex-col gap-4">
        <div className="hidden lg:block absolute top-[-240px] md:left-[-340px] lg:left-[-210px] w-[761px] h-[770px]">
          <Image
            src="/images/delivery/hero/left-image.webp"
            alt={t("alts.leftImage")}
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute bottom-[-174px] left-[-170px] w-[413px] h-[657px] rounded-full bg-[#02060B] blur-[62px]" />
        </div>

        <div className="absolute top-[-350px] md:top-[-414px] right-[-400px] xs:right-[-340px] sm:right-[-300px] md:right-[-260px] lg:right-[-200px] xl:right-[-140px] w-[731px] h-[533px]">
          <Image
            src="/images/delivery/hero/right-image.webp"
            alt={t("alts.rightImage")}
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute rotate-3 top-[-114px] left-[-30px] w-[657px] h-[413px] rounded-full bg-[#02060B] blur-[62px]" />
        </div>

        <div className="relative flex flex-col gap-4 max-w-[463px] mx-auto">
          {" "}
          <div className="relative flex flex-col gap-4 max-w-[363px]">
            <div className="absolute top-[-85px] left-[-20px] xs:left-[-80px] w-[102px] h-[108px]">
              <Image
                src="/images/delivery/hero/decor.webp"
                alt={t("alts.decor")}
                fill
                className="object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <h1 className="mb-10 font-findsans text-40bold uppercase text-white lg:text-40bold">
              {t("title")}
            </h1>
            <p className="mb-10 max-w-[420px] text-16reg leading-relaxed text-white/80">
              {t("text")}
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/menu" variant="primary" size="lg">
              {t("ctaMenu")}
            </Button>
            <PhoneButton
              size="lg"
              shape="pill"
              ariaLabel={t("ctaPhone")}
              className="border-white bg-white text-navy xl:hover:border-white xl:hover:bg-navy/30 xl:hover:text-white transition-colors duration-300 ease-in-out"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
