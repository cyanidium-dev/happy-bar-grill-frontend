import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { getDishPathBySlug } from "@/data/menu";
import type { PageProps } from "@/types/page";

type Props = PageProps<{ slug: string }>;

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Legacy cart / last-order lines only stored the dish slug. This route
 * resolves the category and sends the visitor to the real dish page.
 */
export default async function DishSlugRedirectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const dish = await getDishPathBySlug(slug, locale);
  if (!dish?.categorySlug || !dish.slug) notFound();

  redirect({
    href: `/menu/${dish.categorySlug}/${dish.slug}`,
    locale,
  });
}
