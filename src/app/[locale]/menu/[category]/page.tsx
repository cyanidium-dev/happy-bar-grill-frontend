import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import MenuView from "@/components/menu/MenuView";
import { getCategories, getCategoryBySlug } from "@/data/menu";
import type { PageProps } from "@/types/page";

type MenuCategoryProps = PageProps<{ category: string }>;

// Pre-render every known category (dynamic slugs still 404 via notFound below).
export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: MenuCategoryProps): Promise<Metadata> {
  const { locale, category } = await params;
  const found = getCategoryBySlug(category);
  if (!found) return {};

  const tc = await getTranslations({
    locale,
    namespace: "HomePage.categories.items",
  });
  return { title: tc(found.key) };
}

export default async function MenuCategoryPage({ params }: MenuCategoryProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const found = getCategoryBySlug(category);
  if (!found) notFound();

  const tMenu = await getTranslations("Metadata");
  const tc = await getTranslations("HomePage.categories.items");
  const label = tc(found.key);

  return (
    <>
      <BreadCrumbs
        items={[
          { label: tMenu("menu.title"), href: "/menu" },
          { label },
        ]}
      />
      <MenuView activeSlug={category} />
    </>
  );
}
