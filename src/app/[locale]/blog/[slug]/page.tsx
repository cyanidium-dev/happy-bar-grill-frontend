import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import ArticleHero from "@/components/blog/article/ArticleHero";
import ArticleContent from "@/components/blog/article/ArticleContent";
import BlogFaq from "@/components/blog/article/BlogFaq";
import OtherPosts from "@/components/blog/article/OtherPosts";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getOtherBlogPosts,
} from "@/data/blog";
import type { PageProps } from "@/types/page";

type BlogArticleProps = PageProps<{ slug: string }>;

// Pre-render every article (unknown slugs still 404 via notFound below).
export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticleProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};

  const seo = post.seo;
  const title = seo?.metaTitle || post.title;
  const description = seo?.metaDescription || post.description || undefined;
  const ogImage = seo?.ogImage || post.imageDesktop || post.imageMobile;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tMeta, post] = await Promise.all([
    getTranslations("BlogPage"),
    getTranslations("Metadata"),
    getBlogPostBySlug(slug, locale),
  ]);

  if (!post) notFound();

  const others = await getOtherBlogPosts(slug, locale);
  const coverImage = post.imageDesktop || post.imageMobile;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    ...(coverImage ? { image: [coverImage] } : {}),
    datePublished: post.createdAt,
    ...(post.author?.name
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleHero post={post} />

      <BreadCrumbs
        items={[
          { label: tMeta("blog.title"), href: "/blog" },
          { label: post.title },
        ]}
      />

      <section className="bg-white">
        <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
          <div className="lg:flex lg:gap-10">
            <article className="mx-auto min-w-0 max-w-3xl flex-1 lg:mx-0">
              <ArticleContent content={post.content} />
              {post.faq && post.faq.length > 0 && (
                <BlogFaq title={t("faqTitle")} items={post.faq} />
              )}
            </article>

            <OtherPosts posts={others} className="lg:w-80 lg:shrink-0" />
          </div>
        </Container>
      </section>
    </>
  );
}
