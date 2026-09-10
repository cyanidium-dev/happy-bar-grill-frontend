import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import SettingsView from "@/components/settings/SettingsView";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "settings");
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <div className="flex-1">
      <BreadCrumbs items={[{ label: t("settings.title") }]} />
      <section className="bg-white">
        <SettingsView />
        <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
      </section>
    </div>
  );
}
