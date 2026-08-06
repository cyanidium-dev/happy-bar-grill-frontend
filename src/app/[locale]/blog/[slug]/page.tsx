import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import PagePlaceholder from "@/components/shared/PagePlaceholder";
import { formatSlug } from "@/utils/formatSlug";
import type { PageProps } from "@/types/page";

type BlogArticleProps = PageProps<{ slug: string }>;

// Metadata will come from the CMS article document later; the slug is a
// temporary, SEO-safe stand-in.
export async function generateMetadata({
  params,
}: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: formatSlug(slug) };
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Metadata");
  const articleTitle = formatSlug(slug);

  // Single article (hero + rich content) later; data comes from the CMS.
  return (
    <>
      <BreadCrumbs
        items={[
          { label: t("blog.title"), href: "/blog" },
          { label: articleTitle },
        ]}
      />
      <PagePlaceholder title={articleTitle} />
    </>
  );
}
