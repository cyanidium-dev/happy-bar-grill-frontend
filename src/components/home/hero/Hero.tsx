import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import ImagePlaceholder from "@/components/shared/media/ImagePlaceholder";
import PageTitle from "@/components/shared/titles/PageTitle";

/**
 * Block 1 — first screen. States what you can order and pushes into the menu.
 * (Cart + language switcher live in the persistent Header — a layout concern.)
 *
 * Sits *behind* the fixed Header: a negative top margin cancels the page's
 * header-height padding so this section's own gradient background reaches
 * the very top of the viewport (visible through the transparent header),
 * while a matching top padding keeps its content clear of the header bar.
 */
export default async function Hero() {
  const t = await getTranslations("HomePage.hero");

  return (
    <section
      className="overflow-x-clip bg-gradient-to-br from-navy/15 via-beige to-sand/40"
      style={{
        marginTop: "calc(var(--header-height) * -1)",
        paddingTop: "var(--header-height)",
      }}
    >
      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-20 xl:py-24">
        <AnimatedWrapper animation={{ x: -40 }} className="flex flex-col gap-6">
          <PageTitle>{t("title")}</PageTitle>
          <p className="max-w-xl text-16reg text-graphite xl:text-18reg">
            {t("description")}
          </p>
          <Button href="/menu" size="lg" className="w-full sm:w-fit">
            {t("cta")}
          </Button>
        </AnimatedWrapper>

        <AnimatedWrapper animation={{ x: 40, delay: 0.15 }}>
          <ImagePlaceholder
            label={t("imageAlt")}
            className="aspect-[4/3] rounded-2xl shadow-card"
          />
        </AnimatedWrapper>
      </div>
    </section>
  );
}
