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
      className="relative flex items-end overflow-hidden rounded-b-[24px] pt-[200px] pb-40 lg:rounded-b-[36px]"
      style={{ marginTop: "calc(var(--header-height) * -1)" }}
    >
      <div className="absolute inset-0 -z-20 bg-navy-dark" />
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home/hero/bg.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>

      <Container className="relative flex flex-col gap-4">
        <h1 className="mb-10 font-findsans text-40bold uppercase text-white lg:text-40bold">
          {t("title")}
        </h1>
        <p className="mb-10 max-w-[420px] text-16reg leading-relaxed text-white/80">
          {t("text")}
        </p>

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
      </Container>
    </section>
  );
}
