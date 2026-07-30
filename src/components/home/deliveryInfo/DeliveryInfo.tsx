import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import {
  ADDRESS,
  DELIVERY_COST,
  MAP_QUERY,
  MIN_ORDER,
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

  const rows: { label: string; value: string; href?: string }[] = [
    { label: t("minOrder"), value: MIN_ORDER },
    { label: t("deliveryCost"), value: DELIVERY_COST },
    { label: t("schedule"), value: SCHEDULE },
    { label: t("address"), value: ADDRESS },
    { label: t("phone"), value: PHONE, href: `tel:${PHONE_HREF}` },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    MAP_QUERY,
  )}&output=embed`;

  return (
    <Section id="delivery" background="beige">
      <AnimatedWrapper>
        <SectionTitle>{t("title")}</SectionTitle>
      </AnimatedWrapper>

      <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-2 lg:gap-12">
        <AnimatedWrapper animation={{ x: -30 }} className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-navy/10 pb-3"
              >
                <span className="text-14med text-grey-dark">{row.label}</span>
                {row.href ? (
                  <a
                    href={row.href}
                    className="text-right text-16semi text-navy transition-colors hover:text-red"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="text-right text-16semi text-navy">
                    {row.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <Button href="/delivery" variant="secondary" className="w-full sm:w-fit">
            {t("cta")}
          </Button>
        </AnimatedWrapper>

        <AnimatedWrapper animation={{ x: 30 }}>
          <iframe
            title={t("mapTitle")}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full rounded-2xl border-0 shadow-card lg:aspect-auto lg:h-full lg:min-h-[380px]"
          />
        </AnimatedWrapper>
      </div>
    </Section>
  );
}
