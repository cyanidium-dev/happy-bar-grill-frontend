import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BreadCrumbs from "@/components/shared/BreadCrumbs";
import Container from "@/components/shared/container/Container";
import BlogList from "@/components/blog/BlogList";
import DecorativeEllipsis from "@/components/shared/DecorativeEllipsis";
import { FOOTER_WAVE_HEIGHT_CLASS } from "@/config/footer";
import { getAllBlogPosts } from "@/data/blog";
import { SitePageSeo } from "@/components/seo/SitePageSeo";
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
    <div className="flex-1">
      <section
        className="relative flex items-end overflow-hidden pt-[200px] pb-40 rounded-b-[24px] lg:rounded-b-[36px]"
        style={{ marginTop: "calc(var(--header-height) * -1)" }}
      >
        <div className="absolute inset-0 -z-20 bg-navy-dark" />
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/home/reviews/bg-image.webp"
            alt={t("bgImageAlt")}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[60%_50%]"
          />
        </div>
        <Container className="relative">
          <div className="absolute -z-10 bottom-[-400px] left-[-340px] lg:left-[-200px] xl:left-[-140px] w-[731px] h-[533px]">
            <Image
              src="/images/about/hero/left-image.webp"
              alt={t("leftImageAlt")}
              fill
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute rotate-3 bottom-[240px] left-[-3px] w-[657px] h-[490px] rounded-full bg-[#02060B] blur-[62px]" />
          </div>

          <div className="absolute top-[-280px] sm:top-[-194px] md:top-[-194px] right-[-240px] xs:right-[-240px] sm:right-[-230px] md:right-[-110px] lg:right-[10px] xl:right-[35px] w-[505px] h-[431px]">
            <Image
              src="/images/about/hero/right-image.webp"
              alt={t("rightImageAlt")}
              fill
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <h1 className="font-findsans text-40bold uppercase text-white mb-5 lg:text-40bold">
            {t("heroTitle")}
          </h1>
          <p className="mb-8 max-w-[360px] text-16reg text-white/80">
            {t("heroSubtitle")}
          </p>
          <DecorativeEllipsis />
        </Container>
      </section>

      <BreadCrumbs items={[{ label: tMeta("blog.title") }]} />

      <section className="bg-white pt-10 md:pt-14">
        <Container className="pb-16 pt-6 md:pb-20">
          <BlogList posts={posts} emptyLabel={t("empty")} />
          <div aria-hidden className={FOOTER_WAVE_HEIGHT_CLASS} />
        </Container>
      </section>
      <SitePageSeo pageId="blogPage" />
    </div>
  );
}
