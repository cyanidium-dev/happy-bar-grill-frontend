import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import Image from "next/image";
import { cn } from "@/utils/cn";
import {
  ADDRESS,
  DELIVERY_TIME,
  MAP_QUERY,
  PHONE,
  PHONE_HREF,
  SCHEDULE,
} from "@/constants/contacts";

/**
 * Block 6 — delivery, contacts and map. All the essentials on the home page,
 * with a link to the full "Доставка та оплата" page.
 */
export default async function DeliveryInfo() {
  const t = await getTranslations("HomePage.delivery");

  const rows: {
    label: string;
    value: string;
    href?: string;
    wide?: boolean;
  }[] = [
    { label: t("deliveryTime"), value: DELIVERY_TIME },
    { label: t("schedule"), value: SCHEDULE },
    { label: t("phone"), value: PHONE, href: `tel:${PHONE_HREF}`, wide: true },
    { label: t("address"), value: ADDRESS, wide: true },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    MAP_QUERY,
  )}&output=embed`;

  return (
    <Section
      id="delivery"
      background="beige"
      className="relative z-10 rounded-[24px] lg:rounded-[36px] -top-8 overflow-hidden"
    >
      <div className="absolute -z-10 bg-navy-dark bottom-[-60px] right-[-30px] sm:bottom-[-134px] sm:right-[-69px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full" />
      <div className="absolute z-10 bg-red bottom-[-120px] right-[-90px] sm:bottom-[-270px] sm:right-[-170px] w-[240px] h-[227px] sm:w-[481px] sm:h-[454px] rounded-full" />

      <div className="absolute right-10 top-4 md:top-10 md:right-14 lg:top-14 xl:top-24 lg:left-120 xl:left-148 w-[103px] h-[108px]">
        <Image
          src="/images/home/delivery/decor.webp"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-8 md:mt-2 lg:flex-row lg:items-stretch lg:gap-12">
        <div className="flex flex-col gap-6 lg:flex-1">
          <AnimatedWrapper className="flex flex-col gap-3">
            <SectionTitle>{t("title")}</SectionTitle>
            <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
          </AnimatedWrapper>

          <AnimatedWrapper className="flex flex-col gap-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              {rows.map((row) => (
                <li
                  key={row.label}
                  className={cn(
                    "flex flex-col gap-1 rounded-tl-xl rounded-br-xl bg-white p-4 shadow-card sm:rounded-tl-2xl sm:rounded-br-2xl",
                    row.wide && "sm:col-span-2",
                  )}
                >
                  <span className="text-12med uppercase tracking-wide text-grey-dark">
                    {row.label}
                  </span>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="text-18semi text-navy transition-colors hover:text-red"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-18semi text-navy">{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex relative">
              <div className="absolute -right-36 -bottom-22 w-[273px] h-[242px]">
                <Image
                  src="/images/home/delivery/tomato.webp"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                href="/delivery"
                variant="secondary"
                className="shrink-0 w-fit"
              >
                {t("cta")}
              </Button>
              <div className="relative -z-10 -bottom-6.5 -left-1 h-[3px] w-full rounded-full bg-gradient-to-r from-navy-dark to-beige" />
            </div>
          </AnimatedWrapper>
        </div>

        <AnimatedWrapper className="lg:flex lg:flex-1 lg:flex-col">
          <iframe
            title={t("mapTitle")}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full flex-1 rounded-2xl border-0 shadow-card lg:aspect-auto lg:min-h-0"
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
