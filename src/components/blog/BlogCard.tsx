import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPostPreview } from "@/types/blog";
import { formatBlogDate } from "@/utils/formatDate";

/**
 * Blog post preview card: cover image, date, title, excerpt and a "read more"
 * affordance. Leaf corners + card shadow match the project's card motif.
 */
export default async function BlogCard({ post }: { post: BlogPostPreview }) {
  const t = await getTranslations("BlogPage");
  const locale = (await getLocale()) as Locale;

  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-tl-2xl rounded-br-2xl bg-white shadow-card transition-[box-shadow,transform] duration-300 ease-out xl:hover:-translate-y-1 xl:hover:shadow-card-hover"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {post.image && (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out xl:group-hover:scale-105"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <time dateTime={post.createdAt} className="text-14med text-grey-dark">
            {formatBlogDate(post.createdAt, locale)}
          </time>
          <h3 className="line-clamp-2 text-18semi text-navy transition-colors duration-300 xl:group-hover:text-red">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-14reg leading-relaxed text-graphite">
            {post.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-16med text-navy transition-colors duration-300 xl:group-hover:text-red">
            {t("readMore")}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out xl:group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
