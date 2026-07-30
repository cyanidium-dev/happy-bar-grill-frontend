import { getTranslations } from "next-intl/server";
import Card from "@/components/shared/cards/Card";
import type { Review } from "@/types/content";

/** Single testimonial: rating, quote, author and a link to the source. */
export default async function ReviewCard({ review }: { review: Review }) {
  const t = await getTranslations("Product");

  return (
    <Card as="article" className="flex h-full flex-col gap-4 p-6">
      <div
        className="flex items-center gap-1 text-18med"
        role="img"
        aria-label={t("rating", { value: review.rating })}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            aria-hidden
            className={index < review.rating ? "text-sand" : "text-grey/40"}
          >
            ★
          </span>
        ))}
      </div>

      <p className="flex-1 text-16reg text-graphite">“{review.text}”</p>

      <div className="flex items-center justify-between gap-3">
        <span className="text-16semi text-navy">{review.author}</span>
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-14med text-teal underline-offset-4 hover:underline"
        >
          {review.source}
        </a>
      </div>
    </Card>
  );
}
