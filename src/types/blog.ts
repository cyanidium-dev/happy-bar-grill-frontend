import type { PortableTextBlock } from "@portabletext/react";
import type { PageSeo } from "@/types/seo";

/**
 * Blog content types, shaped to match the `blogPost` / `blogAuthor` GROQ
 * projections. Localized CMS fields (`title`, `description`, `content`, …)
 * arrive already resolved to the active locale via `$locale` in GROQ.
 */

export type BlogAuthor = {
  name: string;
  photo?: string | null;
  photoAlt?: string | null;
  profileUrl?: string | null;
};

export type BlogPostPreview = {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  imageAlt?: string | null;
  /** Sanity `_createdAt` ISO timestamp. */
  createdAt: string;
  author?: { name: string } | null;
};

export type BlogFaqItem = {
  _key: string;
  question: string;
  answer: PortableTextBlock[];
};

export type BlogPostSeo = PageSeo;

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  imageDesktop: string | null;
  imageDesktopAlt?: string | null;
  imageMobile: string | null;
  imageMobileAlt?: string | null;
  createdAt: string;
  content: PortableTextBlock[];
  faq?: BlogFaqItem[] | null;
  author?: BlogAuthor | null;
  seo?: BlogPostSeo | null;
};
