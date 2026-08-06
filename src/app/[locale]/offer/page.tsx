import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/metadata";
import { offerDoc } from "@/data/legal";
import type { Locale } from "@/i18n/routing";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "offer");
}

export default async function PublicOfferPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return <LegalPage title={t("offer.title")} doc={offerDoc[locale as Locale]} />;
}
