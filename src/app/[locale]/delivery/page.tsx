import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import DeliveryHero from "@/components/delivery/DeliveryHero";
import DeliverySteps from "@/components/delivery/DeliverySteps";
import PaymentMethods from "@/components/delivery/PaymentMethods";
import DeliveryConditions from "@/components/delivery/DeliveryConditions";
import { SitePageSeo } from "@/components/seo/SitePageSeo";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "delivery");
}

export default async function DeliveryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <>
      <DeliveryHero />
      <BreadCrumbs items={[{ label: t("delivery.title") }]} />
      <DeliverySteps />
      <DeliveryConditions />
      <PaymentMethods />
      <SitePageSeo pageId="seoDeliveryPage" />
    </>
  );
}
