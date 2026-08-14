"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import ChevronIcon from "@/components/shared/icons/ChevronIcon";
import type { GalleryImage } from "@/types/content";
import { cn } from "@/utils/cn";

// Load the lightbox stylesheet with the gallery chunk so styles are present
// before the first open (avoids a one-time unstyled flash on slow connections).
import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

export type DishGalleryLabels = {
  prev: string;
  next: string;
  /** Raw ICU pattern "{index} / {total}" — formatted on the client. */
  counter: string;
  open: string;
};

/**
 * Dish photo gallery: a main stage with thumbnails, arrows, a counter and a
 * full-screen lightbox. Adapted from the kondor product gallery, restyled to
 * this project (leaf corners, `next/image`, no video slides). A single image
 * still opens the lightbox but shows no arrows/thumbnails.
 */
export default function DishGallery({
  images,
  labels,
  priority = false,
}: {
  images: GalleryImage[];
  labels: DishGalleryLabels;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const hasMany = total > 1;
  const current = images[index];

  const formatCounter = (position: number) =>
    labels.counter
      .replace("{index}", String(position))
      .replace("{total}", String(total));

  const go = useCallback(
    (delta: number) => {
      if (total === 0) return;
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  // Arrow-key navigation while the stage is in view and the lightbox is closed.
  useEffect(() => {
    if (!hasMany) return;
    const stage = stageRef.current;
    if (!stage) return;

    let inView = false;
    const observer = new IntersectionObserver(
      ([entry]) => (inView = entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(stage);

    const onKey = (event: KeyboardEvent) => {
      if (!inView || lightboxOpen) return;
      const el = event.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [go, hasMany, lightboxOpen]);

  if (total === 0) return null;

  return (
    <div>
      {/* Stage */}
      <div
        ref={stageRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-tl-2xl rounded-br-2xl shadow-card"
      >
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          loading={priority && index === 0 ? "eager" : "lazy"}
          fetchPriority={priority && index === 0 ? "high" : "auto"}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 560px"
          className="object-cover"
        />

        {/* Click the stage to open full screen */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={labels.open}
          className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50"
        />

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.prev}
              className={cn(
                "absolute left-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer",
                "flex size-10 items-center justify-center rounded-full",
                "bg-white/80 text-navy shadow-card backdrop-blur",
                "transition duration-300 ease-out hover:bg-white hover:text-red",
                "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50",
              )}
            >
              <ChevronIcon className="size-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className={cn(
                "absolute right-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer",
                "flex size-10 items-center justify-center rounded-full",
                "bg-white/80 text-navy shadow-card backdrop-blur",
                "transition duration-300 ease-out hover:bg-white hover:text-red",
                "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50",
              )}
            >
              <ChevronIcon className="size-5" />
            </button>
            <div className="absolute right-3 top-3 z-20 rounded-full bg-navy/80 px-2.5 py-1 text-12semi text-white backdrop-blur">
              {formatCounter(index + 1)}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMany && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((image, i) => (
            <li key={`${image.url}-${i}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={formatCounter(i + 1)}
                aria-current={i === index}
                className={cn(
                  "relative size-16 cursor-pointer overflow-hidden rounded-tl-lg rounded-br-lg transition duration-300 ease-out sm:size-12 md:size-16",
                  i === index
                    ? "ring-2 ring-navy"
                    : "opacity-70 ring-1 ring-navy/15 hover:opacity-100",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 640px) and (max-width: 767px) 48px, 64px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Full-screen lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        slides={images.map((image) => ({ src: image.url, alt: image.alt }))}
        animation={{ fade: 300, swipe: 200 }}
        carousel={{ finite: !hasMany }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.6)" } }}
      />
    </div>
  );
}
