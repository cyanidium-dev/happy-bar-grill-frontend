"use client";

import { useState } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * The five-star rating, popping in one star at a time when the card arrives.
 *
 * The rating is announced once on the wrapper; the stars themselves are
 * decorative, so the animation has nothing to do with what a screen reader
 * hears.
 */
export default function ReviewStars({
  rating,
  label,
}: {
  rating: number;
  label: string;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();
      mm.add(REDUCED_MOTION, () => {});

      mm.add(FULL_MOTION, () => {
        gsap.from(node.querySelectorAll("[data-star]"), {
          scale: 0,
          rotate: -60,
          opacity: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
        });
      });
    },
    { dependencies: [node] },
  );

  return (
    <div
      ref={setNode}
      className="flex items-center gap-0.5 text-14med"
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          data-star
          aria-hidden
          className={index < rating ? "text-sand" : "text-white/30"}
        >
          ★
        </span>
      ))}
    </div>
  );
}
