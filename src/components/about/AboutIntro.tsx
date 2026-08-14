import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Button from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";

/**
 * About page intro: full-bleed hero with the same background treatment as
 * the blog listing and delivery page — no inset content image.
 */
export default async function AboutIntro() {
  const t = await getTranslations("AboutPage.intro");

  return (
    <section
      className="relative flex items-end overflow-hidden rounded-b-[24px] pt-[170px] pb-30 lg:rounded-b-[36px]"
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
        <p className="max-w-[520px] text-16reg leading-relaxed text-white/80">
          {t("text")}
        </p>
        <p className="mb-10 max-w-[520px] text-16reg leading-relaxed text-white/80">
          {t("text2")}
        </p>

        <div className="mt-2">
          <Button href="/menu" variant="primary" size="lg">
            {t("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
