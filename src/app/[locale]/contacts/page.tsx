import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import ContactInfo from "@/components/contacts/ContactInfo";
import ContactForm from "@/components/contacts/ContactForm";
import ContactsMap from "@/components/contacts/ContactsMap";
import Image from "next/image";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { buildPageMetadata } from "@/lib/metadata";
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
    <>
      <BreadCrumbs items={[{ label: tMeta("contacts.title") }]} />

      <section className="relative z-10 overflow-hidden bg-white">
        <Container className="relative pb-16 pt-10 md:pb-20 md:pt-14">
          <div className="absolute -z-10 bg-navy-dark bottom-0 right-[-30px] sm:bottom-[-74px] sm:right-[-69px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full" />
          <div className="absolute z-10 bg-red bottom-[-60px] right-[-90px] sm:bottom-[-210px] sm:right-[-170px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full" />

          <div className="mb-8 flex max-w-2xl flex-col gap-4 md:mb-10">
            <h1 className="font-findsans text-28bold uppercase text-navy lg:text-40bold">
              {t("title")}
            </h1>
            <p className="text-16reg leading-relaxed text-graphite">
              {t("subtitle")}
            </p>
          </div>

          <div className="relative -z-10 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
            <div
              aria-hidden
              className="hidden xl:block pointer-events-none absolute -z-10 -bottom-26 -left-40 w-[600px] h-[226px]"
            >
              <Image
                src="/images/home/seo-text/grill-plate.webp"
                alt={t("alts.grillPlate")}
                fill
                className="object-cover"
              />
            </div>
            <ContactInfo />
            <ContactForm />
          </div>

          <div className="mt-10 md:mt-14">
            <ContactsMap />
          </div>
          <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
        </Container>
      </section>
    </>
  );
}
