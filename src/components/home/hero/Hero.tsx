import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Container from "@/components/shared/container/Container";
import Image from "next/image";
import PageTitle from "@/components/shared/titles/PageTitle";

const heroImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80";

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

  return (
    <section
      className="relative overflow-hidden rounded-b-[24px] lg:rounded-b-[36px]"
      style={{
        marginTop: "calc(var(--header-height) * -1)",
        paddingTop: "var(--header-height)",
      }}
    >
      <div className="absolute -z-30 inset-0 bg-navy-dark" />
      <div className="absolute -z-20 top-0 left-0 inset-0">
        <Image
          src="/images/home/hero/bg.webp"
          alt={t("imageAlt")}
          fill
          className="object-cover"
        />
      </div>
      <Container className="relative grid items-center gap-10 py-[54px] md:grid-cols-2 md:py-20 xl:py-24">
        <div className="flex flex-col gap-7 mb-[140px] lg:mb-[91px]">
          {/* Own AnimatedWrapper (not the shared one below) so its `-z-15`
              lands on the element that actually establishes the stacking
              context (the `transform` here creates one). Nesting it on
              PageTitle instead — inside the wrapper that groups all three
              children — would trap the z-index inside that wrapper's own
              context, where it can never out-rank the burger image's
              `-z-10`, which lives one level up. */}
          <AnimatedWrapper animation={{ x: -40 }} className="relative -z-15">
            <PageTitle>{t("title")}</PageTitle>
          </AnimatedWrapper>

          <AnimatedWrapper animation={{ x: -40 }}>
            <p className="max-w-[200px] lg:max-w-[181px] mb-1 text-12light text-white">
              {t("description")}
            </p>
          </AnimatedWrapper>

          <AnimatedWrapper animation={{ x: -40 }}>
            <Button
              href="/menu"
              size="lg"
              className="w-full sm:w-fit uppercase text-12bold font-findsans text-white"
            >
              {t("cta")}
            </Button>
          </AnimatedWrapper>
        </div>
        <div className="absolute -z-10 right-[-262px] bottom-[-62px] w-[590px] h-[508px] lg:w-[959px] lg:h-[827px]">
          <Image
            src="/images/home/hero/burger.webp"
            alt={t("imageAlt")}
            fill
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
