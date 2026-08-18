import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import ContactInfo from "@/components/contacts/ContactInfo";
import ContactForm from "@/components/contacts/ContactForm";
import ContactsMap from "@/components/contacts/ContactsMap";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import { fadeIn } from "@/components/shared/animatedWrappers/animation";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { SitePageSeo } from "@/components/seo/SitePageSeo";
import { buildPageMetadata } from "@/lib/metadata";
import { createFormToken } from "@/lib/telegram/formToken";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "contacts");
}

export default async function ContactsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tMeta] = await Promise.all([
    getTranslations("ContactsPage"),
    getTranslations("Metadata"),
  ]);

  return (
    <div className="flex-1">
      <BreadCrumbs items={[{ label: tMeta("contacts.title") }]} />

      <section className="relative z-10 overflow-hidden bg-white">
        <Container className="relative pb-16 pt-10 md:pb-20 md:pt-14">
          <AnimatedWrapper
            className="pointer-events-none absolute -z-10 md:z-15 top-[-120px] right-[-300px] xs:right-[-180px] sm:right-[-140px] md:right-[-100px] h-[458px] w-[535px] lg:right-[-170px] lg:top-[-100px] xl:top-[-100px] xl:right-[-170px] lg:h-[458px] lg:w-[535px]"
            animation={fadeIn()}
            amount={0.01}
          >
            <Image
              src="/images/home/promotions/pizza.webp"
              alt={t("alts.pizza")}
              fill
              sizes="535px"
              className="object-cover"
            />
          </AnimatedWrapper>

          <AnimatedWrapper
            className="hidden lg:block pointer-events-none absolute z-15 top-[10px] xs:top-[50px] left-[280px] xs:left-auto xs:right-[10px] h-[223px] w-[199px] md:top-[50px] lg:left-[460px] lg:top-[60px] xl:left-[570px]"
            animation={fadeIn()}
            amount={0.01}
          >
            <Image
              src="/images/home/promotions/tomato-top.webp"
              alt={t("alts.tomatoTop")}
              fill
              sizes="199px"
              className="object-cover"
            />
          </AnimatedWrapper>

          <AnimatedWrapper
            className="hidden lg:block pointer-events-none absolute z-15 lg:top-[590px] xl:top-[480px] left-[270px] h-[166px] w-[261px]"
            animation={fadeIn()}
            amount={0.01}
          >
            <Image
              src="/images/home/promotions/tomato-bottom.webp"
              alt={t("alts.tomatoBottom")}
              fill
              sizes="261px"
              className="object-cover"
            />
          </AnimatedWrapper>

          <div
            aria-hidden
            className="pointer-events-none hidden xl:block absolute -z-10 bg-navy-dark top-140 left-[110px] sm:w-[321px] sm:h-[303px] rounded-full"
          />
          <div
            aria-hidden
            className="pointer-events-none hidden xl:block absolute z-10 bg-red top-160 left-[190px] sm:w-[321px] sm:h-[303px] rounded-full"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -z-10 bg-navy-dark bottom-0 right-[-30px] sm:bottom-[-74px] sm:right-[-69px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute z-10 bg-red bottom-[-60px] right-[-90px] sm:bottom-[-210px] sm:right-[-170px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full"
          />

          <div className="relative z-10">
            <div className="mb-8 flex max-w-2xl flex-col gap-4 md:mb-10">
              <h1 className="font-findsans text-28bold uppercase text-navy lg:text-40bold">
                {t("title")}
              </h1>
              <p className="max-w-[235px] text-16reg leading-relaxed text-graphite">
                {t("subtitle")}
              </p>
            </div>

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              <ContactInfo />
              <ContactForm formToken={createFormToken()} />
            </div>

            <div className="z-15 relative mt-10 md:mt-14">
              <ContactsMap />
            </div>
            <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
          </div>
        </Container>
      </section>
      <SitePageSeo pageId="seoContactsPage" />
    </div>
  );
}
