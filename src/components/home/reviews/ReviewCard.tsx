import { getTranslations } from "next-intl/server";
import CardMedia from "@/components/shared/cards/CardMedia";
import QuoteIcon from "@/components/shared/icons/QuoteIcon";
import type { Review } from "@/types/content";

/** Single testimonial: avatar, rating, quote, author and a link to the source. */
export default async function ReviewCard({ review }: { review: Review }) {
  const t = await getTranslations("Product");

  return (
    <article className="relative flex h-full flex-col rounded-tl-xl rounded-br-xl shadow-card sm:rounded-tl-2xl sm:rounded-br-2xl">
      {/*
        Glass plate is a sibling of the content — never on the same node as
        overflow-hidden — to avoid paint smudges in Chrome/Safari.
      */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] bg-white/16 backdrop-blur-[4px]"
      />

      <div className="relative z-[1] flex h-full flex-col gap-4 p-6">
        <QuoteIcon className="absolute right-5 top-5 size-9 text-white" />

        <div className="flex items-center gap-3">
          <CardMedia
            src={review.avatar}
            alt={review.author}
            className="size-12 shrink-0 rounded-full ring-2 ring-white"
            sizes="48px"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-16semi text-white">
              {review.author}
            </span>
            <div
              className="flex items-center gap-0.5 text-14med"
              role="img"
              aria-label={t("rating", { value: review.rating })}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  aria-hidden
                  className={index < review.rating ? "text-sand" : "text-white/30"}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="flex-1 text-16reg text-white">“{review.text}”</p>

        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-14med text-blue underline-offset-4 hover:underline"
        >
          {review.source}
        </a>
      </div>
    </article>
  );
}
