import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import BlogCard from "./BlogCard";
import type { BlogPostPreview } from "@/types/blog";

/**
 * Responsive grid of blog post cards; each card reveals on scroll. Shows an
 * empty state when the CMS has no published posts yet.
 */
export default function BlogList({
  posts,
  emptyLabel,
}: {
  posts: BlogPostPreview[];
  emptyLabel: string;
}) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-16reg text-grey-dark">{emptyLabel}</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <AnimatedWrapper
          key={post.slug}
          as="li"
          animation={{ y: 24, delay: (index % 3) * 0.06 }}
          className="h-full"
        >
          <BlogCard post={post} />
        </AnimatedWrapper>
      ))}
    </ul>
  );
}
