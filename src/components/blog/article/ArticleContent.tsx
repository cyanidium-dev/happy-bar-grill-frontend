import { PortableText } from "@portabletext/react";
import { blogPortableTextComponents } from "@/components/blog/portableText/portableTextComponents";
import type { BlogPost } from "@/types/blog";

/** Renders the article body (localized Portable Text) with project serializers. */
export default function ArticleContent({
  content,
}: {
  content: BlogPost["content"];
}) {
  if (!content?.length) return null;

  return (
    <div className="text-graphite">
      <PortableText value={content} components={blogPortableTextComponents} />
    </div>
  );
}
