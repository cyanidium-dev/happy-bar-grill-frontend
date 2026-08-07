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
          className="object-cover object-[60%_50%]"
        />
      </div>
      <Container className="relative items-center gap-10">
        <div className="flex min-w-0 flex-col gap-7 mb-[140px] xs:mb-[91px]">
          <div className="relative -z-15">
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

        <div className="absolute -z-10 left-[69px] lg:left-[585px] bottom-[-254px] lg:bottom-[-294px] w-[590px] h-[508px] lg:w-[959px] lg:h-[827px]">
          <Image
            src="/images/home/hero/burger.webp"
            alt={t("burgerImageAlt")}
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:hidden absolute -z-5 left-[91px] bottom-[-332px] w-[550px] h-[432px]">
          <Image
            src="/images/home/hero/navy-ellipse-mob.svg"
            alt={t("ellipseMobileAlt")}
            fill
            className="object-cover"
          />
        </div>
        <div className="hidden lg:block absolute -z-5 left-[590px] bottom-[-692px] w-[1331px] h-[900px]">
          <Image
            src="/images/home/hero/navy-ellipse-desk.svg"
            alt={t("ellipseDesktopAlt")}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -z-15 left-[-260px] bottom-[-532px] lg:left-[230px] xl:left-[371px] lg:bottom-[-442px] right-[-241px] bottom-[-242px] w-[1331px] h-[900px] mix-blend-plus-lighter">
          <Image
            src="/images/home/hero/lighter-small.svg"
            alt={t("lightingAlt")}
            fill
            className="object-cover"
          />
        </div>
      </Container>
      <div className="min-w-0 xs:max-w-full lg:max-w-[1024px] xl:max-w-[1280px] lg:px-20 sm:ml-[calc(50%-320px)] md:ml-[calc(50%-384px)] lg:ml-[calc(50%-512px)] xl:ml-[calc(50%-640px)] mx-auto">
        <ul className="flex min-w-0 gap-3 overflow-x-auto pl-6 lg:pl-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredDishes.map((dish) => (
            <li key={dish.slug}>
              <HeroDishCard dish={dish} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
