import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
import { formatSlug } from "@/utils/formatSlug";
import type { PageProps } from "@/types/page";

type MenuCategoryProps = PageProps<{ category: string }>;

// Metadata will come from the CMS category document later; the slug is a
// temporary, SEO-safe stand-in.
export async function generateMetadata({
  params,
}: MenuCategoryProps): Promise<Metadata> {
  const { category } = await params;
  return { title: formatSlug(category) };
}

export default async function MenuCategoryPage({ params }: MenuCategoryProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  // Dishes for this category (grid + add-to-cart, dish modal) later.
  return <PagePlaceholder title={formatSlug(category)} />;
}
