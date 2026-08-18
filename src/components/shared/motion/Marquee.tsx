"use client";

import { useState } from "react";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  ScrollTrigger,
  gsap,
  useGSAP,
} from "@/lib/gsap";

/**
 * Endless ticker strip that leans into the scroll.
 *
 * The row is rendered twice and shifted by exactly half its width, so the
 * moment the first copy leaves the frame the second is already sitting where
 * it started — the seam never lands on screen.
 *
 * Scrolling nudges the speed and flips the direction, which is what stops it
 * reading as a static loop playing in the background.
 */
export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const track = node.querySelector("[data-marquee-track]");
      if (!track) return;

      const mm = gsap.matchMedia();

      // A loop that never stops is exactly what reduced motion is about.
      mm.add(REDUCED_MOTION, () => {});

      mm.add(FULL_MOTION, () => {
        const loop = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 24,
          repeat: -1,
        });

        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Direction flips with the scroll; velocity adds a short burst on
            // top of the resting speed.
            const boost = Math.min(Math.abs(self.getVelocity()) / 600, 4);
            loop.timeScale((self.direction || 1) * (1 + boost));
          },
        });

        return () => {
          trigger.kill();
          loop.kill();
        };
      });
    },
    { dependencies: [node] },
  );

  // Four copies, shifted by half the track: the two that scroll off are
  // already replaced by the two behind them. Two copies alone would leave a
  // gap on a wide screen if the phrase list is short.
  const row = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={setNode}
      aria-hidden
      className={`flex overflow-hidden ${className ?? ""}`}
    >
      <div data-marquee-track className="flex shrink-0 items-center gap-8 pr-8">
        {row.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-8">
            <span className="font-findsans text-20bold uppercase xl:text-28bold">
              {item}
            </span>
            <span className="size-2 shrink-0 rounded-full bg-red" />
          </span>
        ))}
      </div>
    </div>
  );
}
