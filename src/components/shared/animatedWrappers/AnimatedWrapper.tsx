"use client";

import {
  createElement,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type Animation = {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  /** seconds */
  duration?: number;
  /** seconds — stagger list items by passing index * step */
  delay?: number;
};

type AnimatedWrapperProps = {
  as?: ElementType;
  className?: string;
  animation?: Animation;
  /** Reveal only once (default) or re-run when scrolled out and back. */
  once?: boolean;
  /** IntersectionObserver threshold. */
  amount?: number;
  children: ReactNode;
};

/**
 * Dependency-free scroll reveal (same intent as bravo's framer-motion
 * `AnimatedWrapper`, minus the library). Renders `children` on the server
 * (SEO-friendly), then fades/slides them in when they enter the viewport.
 *
 * `prefers-reduced-motion` is handled in CSS (globals disables transitions), so
 * reduced-motion users simply get the content with no movement.
 */
export default function AnimatedWrapper({
  as = "div",
  className,
  animation = {},
  once = true,
  amount = 0.2,
  children,
}: AnimatedWrapperProps) {
  const { x = 0, y = 24, scale = 1, opacity = 0, duration = 0.6, delay = 0 } =
    animation;

  // Callback ref (state) — avoids reading a ref during render.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: amount },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, once, amount]);

  const style: CSSProperties = {
    opacity: visible ? 1 : opacity,
    transform: visible
      ? "translate3d(0, 0, 0) scale(1)"
      : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
    willChange: "opacity, transform",
  };

  return createElement(as, { ref: setNode, className, style }, children);
}
