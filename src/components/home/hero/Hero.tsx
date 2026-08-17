import { getTranslations } from "next-intl/server";
import Button from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";
import HeroDishCard from "@/components/home/hero/HeroDishCard";
import Image from "next/image";
import PageTitle from "@/components/shared/titles/PageTitle";
import { getHeroDishes } from "@/data/menu";

/**
 * Block 1 — first screen. States what you can order and pushes into the menu.
 * (Cart + language switcher live in the persistent Header — a layout concern.)
 *
 * Sits *behind* the fixed Header: a negative top margin cancels the page's
 * header-height padding so this section's own beige background reaches
 * the very top of the viewport (visible through the transparent header),
 * while a matching top padding keeps its content clear of the header bar.
 */
export default async function Hero() {
  const t = await getTranslations("HomePage.hero");
  const featuredDishes = await getHeroDishes();

  return (
    <section
      className="relative overflow-hidden rounded-b-[24px] lg:rounded-b-[36px] pt-[123px] pb-[54px] md:pt-30 lg:pt-[150px] md:pb-[38px]"
      style={{
        marginTop: "calc(var(--header-height) * -1)",
      }}
    >
      <div className="absolute -z-30 inset-0 bg-navy-dark" />
      <div className="absolute -z-20 top-0 left-0 inset-0">
        <Image
          src="/images/home/hero/bg.webp"
          alt={t("bgImageAlt")}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>
      <Container className="relative items-center gap-10">
        <div className="flex min-w-0 flex-col gap-7 mb-[140px] xs:mb-[91px]">
          <div className="">
            <PageTitle className="max-w-[301px] sm:max-w-[540px]">
              {t("title")}
            </PageTitle>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row-reverse lg:justify-between lg:items-center lg:max-w-[500px]">
            {" "}
            <p className="max-w-[220px] lg:max-w-[221px] mb-1 text-12light text-white">
              {t("description")}
            </p>
            <Button
              href="/menu"
              size="lg"
              className="w-full xs:w-fit uppercase text-12bold font-findsans text-white"
            >
              {t("cta")}
            </Button>
          </div>
        </div>

        <div className="absolute -z-10 left-[calc(50%-182px)] bottom-[-223px] xs:left-[69px] md:left-[200px] lg:left-[555px] xl:left-[585px] xs:bottom-[-204px] md:bottom-[-204px] lg:bottom-[-204px] xl:lg:bottom-[-294px] w-[409px] h-[353px] xs:w-[590px] xs:h-[508px] lg:w-[750px] lg:h-[647px] xl:w-[959px] xl:h-[827px]">
          <Image
            src="/images/home/hero/burger.webp"
            alt={t("burgerImageAlt")}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 519px) 409px, (max-width: 1023px) 590px, (max-width: 1279px) 750px, 959px"
            className="object-cover"
          />
        </div>

        <div className="lg:hidden absolute -z-5 left-[91px] xs:left-[160px] bottom-[-442px] w-[550px] h-[432px]">
          <Image
            src="/images/home/hero/navy-ellipse-mob.svg"
            alt={t("ellipseMobileAlt")}
            fill
            sizes="550px"
            className="object-cover"
          />
        </div>
        <div className="hidden lg:block absolute -z-5 left-[590px] bottom-[-692px] w-[1331px] h-[900px]">
          <Image
            src="/images/home/hero/navy-ellipse-desk.svg"
            alt={t("ellipseDesktopAlt")}
            fill
            sizes="1331px"
            className="object-cover"
          />
        </div>
        <div className="hidden lg:block absolute -z-15 left-[calc(50%-580px)] sm:left-[-260px] bottom-[-472px] md:left-[-140px] lg:left-[320px] xl:left-[371px] md:bottom-[-472px] lg:bottom-[-402px] xl:bottom-[-442px] w-[1331px] h-[900px] mix-blend-plus-lighter">
          <Image
            src="/images/home/hero/lighter-small.svg"
            alt={t("lightingAlt")}
            fill
            sizes="1331px"
            className="object-cover"
          />
        </div>
      </Container>
      <div className="min-w-0 xs:max-w-full lg:max-w-[1024px] xl:max-w-[1280px] lg:px-20 sm:ml-[calc(50%-320px)] md:ml-[calc(50%-384px)] lg:ml-[calc(50%-512px)] xl:ml-[calc(50%-640px)] mx-auto">
        <ul className="flex min-w-0 items-stretch gap-3 overflow-x-auto pl-6 lg:pl-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredDishes.map((dish) => (
            <li key={dish.slug} className="flex shrink-0">
              <HeroDishCard dish={dish} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
