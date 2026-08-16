"use client";

import {
  createElement,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { Animation } from "./animation";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

export type { Animation } from "./animation";
export { delayAfterCards, fadeIn } from "./animation";

type AnimatedWrapperProps = {
  as?: ElementType;
  className?: string;
  animation?: Animation;
  /** Reveal only once (default) or re-run when scrolled out and back. */
  once?: boolean;
  /** Roughly how much of the element must be in view before it reveals. */
  amount?: number;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export default function AnimatedWrapper({
  as = "div",
  className,
  animation = {},
  once = true,
  amount = 0.2,
  children,
  ...rest
}: AnimatedWrapperProps) {
  const {
    x = 0,
    y = 24,
    scale = 1,
    opacity = 0,
    duration = 0.6,
    delay = 0,
  } = animation;

  const moves = x !== 0 || y !== 0 || scale !== 1;

  // Callback ref held in state, not a ref object — handing a ref to
  // `createElement` reads it during render.
  const [node, setNode] = useState<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();

      // The globals.css reduced-motion block only neutralises CSS animation;
      // GSAP writes inline styles and would sail straight through it.
      mm.add(REDUCED_MOTION, () => {
        gsap.set(node, { opacity: 1, clearProps: "transform" });
      });

      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          node,
          { opacity, ...(moves ? { x, y, scale } : {}) },
          {
            opacity: 1,
            ...(moves ? { x: 0, y: 0, scale: 1 } : {}),
            duration,
            delay,
            ease: "power2.out",
            /**
             * Drop the transform once the element lands. A lingering transform
             * makes the node a backdrop root, which kills `backdrop-filter` on
             * the frosted dish cards nested inside these wrappers.
             */
            clearProps: moves ? "transform" : undefined,
            scrollTrigger: {
              trigger: node,
              start: `top ${Math.round(100 - amount * 100)}%`,
              once,
              toggleActions: once
                ? "play none none none"
                : "play none none reverse",
            },
          },
        );
      });
    },
    { dependencies: [node] },
  );

  return createElement(
    as,
    { ref: setNode, className, style: { opacity: 0 }, ...rest },
    children,
  );
}
