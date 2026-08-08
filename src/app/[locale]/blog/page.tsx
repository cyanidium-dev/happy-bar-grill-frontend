import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import BlogList from "@/components/blog/BlogList";
import { getAllBlogPosts } from "@/data/blog";
import { buildPageMetadata } from "@/lib/metadata";
import type { PageProps } from "@/types/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "blog");
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tMeta, posts] = await Promise.all([
    getTranslations("BlogPage"),
    getTranslations("Metadata"),
    getAllBlogPosts(locale),
  ]);

  return (
    <>
      <section
        className="relative flex items-end overflow-hidden pt-[200px] pb-40 rounded-b-[24px] lg:rounded-b-[36px]"
        style={{ marginTop: "calc(var(--header-height) * -1)" }}
      >
        <div className="absolute inset-0 -z-20 bg-navy-dark" />
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/home/hero/bg.webp"
            alt=""
            fill
            className="object-cover object-[60%_50%]"
            priority
          />
        </div>
        <Container className="relative">
          <h1 className="font-findsans text-40bold uppercase text-white mb-18 lg:text-40bold">
            {t("heroTitle")}
          </h1>
          <p className="max-w-[360px] text-16reg leading-relaxed text-white/80">
            {t("heroSubtitle")}
          </p>
        </Container>
      </section>

      <BreadCrumbs items={[{ label: tMeta("blog.title") }]} />

      <section className="bg-white pt-10 md:pt-14">
        <Container className="pb-16 pt-6 md:pb-20">
          <BlogList posts={posts} emptyLabel={t("empty")} />
        </Container>
      </section>
    </>
  );
}
