"use client";

import {
  createElement,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { Animation } from "./animation";

export type { Animation } from "./animation";
export { delayAfterCards, fadeIn } from "./animation";

type AnimatedWrapperProps = {
  as?: ElementType;
  className?: string;
  animation?: Animation;
  /** Reveal only once (default) or re-run when scrolled out and back. */
  once?: boolean;
  /** IntersectionObserver threshold. */
  amount?: number;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

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

  // Callback ref (state) — avoids reading a ref during render.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  // Once the reveal transition has actually finished, we drop `transform`/
  // `will-change` entirely (see below) instead of just resetting them to
  // identity values.
  const [settled, setSettled] = useState(false);

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

  useEffect(() => {
    if (!visible) {
      setSettled(false);
      return;
    }
    const timer = setTimeout(
      () => setSettled(true),
      (duration + delay) * 1000 + 50,
    );
    return () => clearTimeout(timer);
  }, [visible, duration, delay]);

  // `transform` (even an identity `translate3d(0,0,0)`) and `will-change:
  // transform` both make the element establish its own stacking context —
  // which, as a side effect, becomes a "backdrop root" that blocks any
  // `backdrop-filter` on a descendant from seeing content painted outside
  // this box (e.g. a background image elsewhere in the DOM). Once the reveal
  // has finished playing, neither property does anything useful anymore, so
  // we drop them instead of leaving `translate3d(0, 0, 0)` sitting there
  // forever — that keeps descendants' stacking/backdrop-filter behavior
  // normal at rest. Opacity-only reveals skip `transform` entirely.
  const style: CSSProperties = settled
    ? { opacity: 1 }
    : moves
      ? {
          opacity: visible ? 1 : opacity,
          transform: visible
            ? "translate3d(0, 0, 0) scale(1)"
            : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
          willChange: "opacity, transform",
        }
      : {
          opacity: visible ? 1 : opacity,
          transition: `opacity ${duration}s ease-out ${delay}s`,
          willChange: "opacity",
        };

  return createElement(as, { ref: setNode, className, style, ...rest }, children);
}
