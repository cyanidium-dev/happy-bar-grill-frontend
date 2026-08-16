"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  FULL_MOTION,
  REDUCED_MOTION,
  SplitText,
  gsap,
  useGSAP,
} from "@/lib/gsap";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * The hero's `<section>`, with its opening choreography.
 *
 * Children arrive already rendered on the server — same trick as
 * `SwiperWrapper` — so nothing here costs the hero its server rendering.
 *
 * Everything animates *from* a displaced state rather than being hidden in the
 * markup, so a visitor whose JS never arrives still sees a finished hero.
 */
export default function HeroMotion({ className, style, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: the markup is already the finished state, so there is
      // simply nothing to do.
      mm.add(REDUCED_MOTION, () => {});

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // `autoSplit` re-splits once FindSans finishes swapping in, which
        // otherwise leaves the line boxes measured against the fallback font.
        const split = SplitText.create("[data-hero-title] h1", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 115,
              duration: 0.85,
              stagger: 0.04,
              ease: "power3.out",
            });
          },
        });

        tl.from(
          "[data-hero-copy] > *",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 },
          0.4,
        )
          .from(
            "[data-hero-burger]",
            {
              y: 70,
              scale: 0.94,
              opacity: 0,
              duration: 1.1,
              ease: "power2.out",
            },
            0.05,
          )
          /**
           * Opacity only. These cards are frosted glass, and a transform on an
           * ancestor turns it into a backdrop root, which switches the blur
           * off — the same reason `fadeIn()` exists in `animation.ts`.
           */
          .from(
            "[data-hero-rail] > li",
            { opacity: 0, duration: 0.5, stagger: 0.09 },
            0.55,
          );

        const parallax = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        };

        gsap.to("[data-hero-burger]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: parallax,
        });
        gsap.to("[data-hero-bg]", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: parallax,
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={className} style={style}>
      {children}
    </section>
  );
}
