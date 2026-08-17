import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import LegalPage from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/metadata";
import { privacyDoc } from "@/data/legal";
import type { Locale } from "@/i18n/routing";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "privacy");
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <div className="flex-1">
      <BreadCrumbs items={[{ label: t("privacy.title") }]} />
      <LegalPage
        title={t("privacy.title")}
        doc={privacyDoc[locale as Locale]}
      />
    </div>
  );
}
