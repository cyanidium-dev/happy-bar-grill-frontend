import { getTranslations } from "next-intl/server";
import BlogCard from "@/components/blog/BlogCard";
import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import type { BlogPostPreview } from "@/types/blog";
import { cn } from "@/utils/cn";

/**
 * "Other posts" block. On mobile it's a horizontal Swiper (same shell as
 * PopularDishes / SimilarDishes); on desktop it sits in the article sidebar
 * as a vertical list. Hidden when there are no other posts.
 */
export default async function OtherPosts({
  posts,
  className,
}: {
  posts: BlogPostPreview[];
  className?: string;
}) {
  if (posts.length === 0) return null;

  const [t, tSlider] = await Promise.all([
    getTranslations("BlogPage"),
    getTranslations("Common.slider"),
  ]);

  return (
    <aside className={cn("mt-20 lg:mt-0", className)}>
      <div className="relative">
        <h2 className="pr-24 text-20semi text-navy lg:pr-0 lg:text-24semi">
          {t("otherPostsTitle")}
        </h2>

        <div className="mt-5 lg:hidden">
          <SwiperWrapper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
            }}
            buttonsClassName="absolute right-0 -top-1"
            prevLabel={tSlider("prev")}
            nextLabel={tSlider("next")}
            slides={posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          />
        </div>

        <ul className="mt-5 hidden grid-cols-1 gap-5 lg:grid">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
