import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";

/**
 * Closing invitation. Turns "newly opened" into the hook (be among the first
 * guests) with CTAs to the menu, contacts and delivery — all honest, no claims.
 */
export default async function AboutInvite() {
  const t = await getTranslations("AboutPage.invite");

  return (
    <Section background="navy" waveTop="white" className="text-center">
      <AnimatedWrapper className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <SectionTitle variant="white">{t("title")}</SectionTitle>
        <p className="text-16reg leading-relaxed text-white/85">{t("text")}</p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button href="/menu" variant="primary" shape="leaf" size="lg">
            {t("cta")}
          </Button>
          <Link
            href="/contacts"
            className="text-16med text-white underline-offset-4 transition-colors duration-300 hover:text-red hover:underline"
          >
            {t("contacts")}
          </Link>
        </div>

        <p className="text-14reg text-white/70">
          {t("deliveryNote")}{" "}
          <Link
            href="/delivery"
            className="underline underline-offset-4 transition-colors duration-300 hover:text-red"
          >
            {t("deliveryLink")}
          </Link>
        </p>
      </AnimatedWrapper>
    </Section>
  );
}
