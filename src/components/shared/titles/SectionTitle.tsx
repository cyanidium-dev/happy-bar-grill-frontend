"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  SplitText,
  gsap,
  useGSAP,
} from "@/lib/gsap";

type SectionTitleProps = {
  children: ReactNode;
  /** `navy` (default, on light) vs `white` (on dark sections). */
  variant?: "navy" | "white";
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Section heading (<h2> by default). Display font, uppercase.
 *
 * Reveals word by word from behind a line mask when it scrolls into view.
 * Every section on every page goes through this component, so the reveal is
 * defined once here rather than wired up per section.
 */
export default function SectionTitle({
  children,
  variant = "navy",
  as: Tag = "h2",
  className,
}: SectionTitleProps) {
  const [node, setNode] = useState<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();

      // Reduced motion: the heading is already in its finished state.
      mm.add(REDUCED_MOTION, () => {});

      mm.add(FULL_MOTION, () => {
        /**
         * Split once, after the font has settled. `autoSplit` re-splits when
         * FindSans swaps in and re-runs `onSplit`, which replayed the reveal a
         * second time. Waiting for `fonts.ready` gets the same correct line
         * boxes from one split, and the markup goes back after the words land
         * so a later resize has nothing stale to reflow.
         */
        let split: SplitText | null = null;

        document.fonts.ready.then(() => {
          split = SplitText.create(node, {
            type: "lines,words",
            mask: "lines",
          });

          gsap.from(split.words, {
            yPercent: 110,
            duration: 0.7,
            stagger: 0.035,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
            onComplete: () => split?.revert(),
          });
        });

        return () => split?.revert();
      });
    },
    { dependencies: [node] },
  );

  return (
    <Tag
      ref={setNode}
      className={cn(
        "font-findsans text-24bold lg:text-28bold xl:text-40bold uppercase",
        variant === "white" ? "text-white" : "text-navy",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
