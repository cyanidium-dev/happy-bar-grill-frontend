import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import ConfirmationView from "@/components/checkout/ConfirmationView";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "confirmation");
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");

  return (
    <main className="flex-1">
      <BreadCrumbs items={[{ label: t("confirmation.title") }]} />
      <section className="bg-white">
        <ConfirmationView />
        <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
      </section>
    </main>
  );
}
