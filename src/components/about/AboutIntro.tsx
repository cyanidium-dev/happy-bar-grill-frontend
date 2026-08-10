import Image from "next/image";
import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";

/** Decorative stock image (swap for a real venue/food photo later). */
const introImage =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

/**
 * About intro: brand concept for a newly-opened bar & grill in Mykolaiv, with a
 * decorative stock image. No history/achievements — the venue has just opened.
 */
export default async function AboutIntro() {
  const t = await getTranslations("AboutPage.intro");

  return (
    <Section background="white" accent="warm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <AnimatedWrapper className="flex flex-col gap-4 lg:flex-1">
  
          <h1 className="font-findsans text-28bold uppercase text-navy lg:text-36bold xl:text-40bold">
            {t("title")}
          </h1>
          <p className="text-16reg leading-relaxed text-graphite">{t("text")}</p>
          <p className="text-16reg leading-relaxed text-graphite">
            {t("text2")}
          </p>
          <div className="mt-2">
            <Button href="/menu" variant="primary" shape="leaf">
              {t("cta")}
            </Button>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper animation={{ x: 30 }} className="lg:flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tl-2xl rounded-br-2xl shadow-card">
            <Image
              src={introImage}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
