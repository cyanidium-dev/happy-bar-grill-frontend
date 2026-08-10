import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
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
      
     className="rounded-[24px] lg:rounded-[36px relative -top-4"
    >
      <div className="flex flex-col gap-8 md:mt-2 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-col gap-6 lg:flex-1">
          <AnimatedWrapper className="flex flex-col gap-3">
            <SectionTitle>{t("title")}</SectionTitle>
            <p className="max-w-2xl text-16reg text-graphite">{t("text")}</p>
          </AnimatedWrapper>

          <AnimatedWrapper
            animation={{ x: -30 }}
            className="flex flex-col gap-6"
          >
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
                      className="text-20semi text-navy transition-colors hover:text-red"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-20semi text-navy">{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
            <Button
              href="/delivery"
              variant="secondary"
              className="w-full sm:w-fit"
            >
              {t("cta")}
            </Button>
          </AnimatedWrapper>
        </div>

        <AnimatedWrapper animation={{ x: 30 }} className="lg:flex-1">
          <iframe
            title={t("mapTitle")}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full rounded-2xl border-0 shadow-card lg:aspect-auto lg:h-[420px]"
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
