import Image, { getImageProps } from "next/image";
import { getLocale } from "next-intl/server";
import Container from "@/components/shared/container/Container";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/types/blog";
import { formatBlogDate } from "@/utils/formatDate";

/**
 * Full-bleed article header: the cover image is a full-width background, with
 * the title, lead paragraph and author/date overlaid on a dark scrim for
 * legibility. Responsive mobile/desktop image variants come from the CMS.
 */
export default async function ArticleHero({ post }: { post: BlogPost }) {
  const locale = (await getLocale()) as Locale;
  const desktopSrc = post.imageDesktop || post.imageMobile;
  const mobileSrc = post.imageMobile || post.imageDesktop;
  const mobileAlt = post.imageMobileAlt || post.title;
  const desktopAlt = post.imageDesktopAlt || post.title;

  let cover = null;
  if (mobileSrc && desktopSrc && mobileSrc !== desktopSrc) {
    const common = { fill: true as const, sizes: "100vw" };
    const {
      props: { srcSet: desktop },
    } = getImageProps({ ...common, alt: desktopAlt, src: desktopSrc });
    const {
      props: { srcSet: mobile, ...img },
    } = getImageProps({
      ...common,
      alt: mobileAlt,
      src: mobileSrc,
      loading: "eager",
      fetchPriority: "high",
    });
    cover = (
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet={desktop} />
        <img {...img} alt={mobileAlt} srcSet={mobile} className="object-cover" />
      </picture>
    );
  } else if (mobileSrc || desktopSrc) {
    cover = (
      <Image
        src={(mobileSrc || desktopSrc)!}
        alt={mobileAlt}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
    );
  }

  return (
    <header
      className="relative w-full overflow-hidden rounded-b-[24px] bg-black lg:rounded-b-[36px]"
      style={{ marginTop: "calc(var(--header-height) * -1)" }}
    >
      {cover}

      {/* Scrim so overlaid text stays readable over any photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25"
      />

      <Container className="relative flex min-h-[360px] flex-col justify-end gap-5 pb-10 pt-[123px] md:min-h-[460px] md:pb-14 md:pt-30 lg:min-h-[540px] lg:pt-[150px]">
        <h1 className="mb-18 max-w-3xl font-findsans text-28bold uppercase text-white lg:text-40bold">
          {post.title}
        </h1>
        {post.description && (
          <p className="mb-10 max-w-2xl text-16reg leading-relaxed text-white/85 lg:text-18reg">
            {post.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          {post.author?.photo && (
            <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/40">
              <Image
                src={post.author.photo}
                alt={post.author.photoAlt || post.author.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
          )}
          <div className="flex flex-col">
            {post.author?.name && (
              <span className="text-16semi text-white">{post.author.name}</span>
            )}
            <time
              dateTime={post.createdAt}
              className="text-14med text-white/70"
            >
              {formatBlogDate(post.createdAt, locale)}
            </time>
          </div>
        </div>
      </Container>
    </header>
  );
}
