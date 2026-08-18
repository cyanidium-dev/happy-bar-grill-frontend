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
 * Hairline reading-progress bar pinned above the header.
 *
 * Scrubbed straight off scroll position rather than tweened, so it tracks the
 * scrollbar exactly instead of lagging behind it.
 */
export default function ScrollProgress() {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();

      // A progress indicator is information, not decoration: it still tracks
      // the scroll under reduced motion, just without the smoothing.
      mm.add(REDUCED_MOTION, () => {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => gsap.set(node, { scaleX: self.progress }),
        });
      });

      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          node,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
          },
        );
      });
    },
    { dependencies: [node] },
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] pr-[var(--scroll-lock-offset,0px)]"
    >
      <div
        ref={setNode}
        className="h-full w-full origin-left scale-x-0 bg-red"
      />
    </div>
  );
}
