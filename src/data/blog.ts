import { cache } from "react";
import { getLocale } from "next-intl/server";
import type { BlogPost, BlogPostPreview } from "@/types/blog";
import { routing, type Locale } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ALL_BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POST_SLUGS_QUERY,
} from "@/sanity/lib/queries";

/**
 * Blog data access layer. Components call these accessors and never touch
 * Sanity queries directly. Localized fields are resolved inside GROQ via
 * `$locale`. Mirrors the `data/menu.ts` pattern.
 */

async function resolveLocale(override?: Locale): Promise<Locale> {
  if (override) return override;
  try {
    return (await getLocale()) as Locale;
  } catch {
    return routing.defaultLocale;
  }
}

export const getAllBlogPosts = cache(
  async (locale?: Locale): Promise<BlogPostPreview[]> => {
    return sanityFetch<BlogPostPreview[]>({
      query: ALL_BLOG_POSTS_QUERY,
      params: { locale: await resolveLocale(locale) },
      tags: ["blogPost"],
    });
  },
);

export const getBlogPostBySlug = cache(
  async (slug: string, locale?: Locale): Promise<BlogPost | null> => {
    return sanityFetch<BlogPost | null>({
      query: BLOG_POST_BY_SLUG_QUERY,
      params: { slug, locale: await resolveLocale(locale) },
      tags: ["blogPost", `blogPost:${slug}`],
    });
  },
);

/** Recent posts other than `slug`, for the "other posts" block (max 4). */
export const getOtherBlogPosts = cache(
  async (slug: string, locale?: Locale): Promise<BlogPostPreview[]> => {
    const posts = await getAllBlogPosts(locale);
    return posts.filter((post) => post.slug !== slug).slice(0, 4);
  },
);

export const getBlogPostSlugs = cache(async (): Promise<string[]> => {
  return sanityFetch<string[]>({
    query: BLOG_POST_SLUGS_QUERY,
    tags: ["blogPost"],
  });
});
