"use client";

import { useState, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Fades page content in on every navigation.
 *
 * Opacity only, deliberately. This element wraps the entire page, and a
 * transform on it would make it a backdrop root — switching off the frosted
 * glass on every dish card, review and hero card underneath at once.
 *
 * Rendered by `template.tsx`, which React remounts on each route change.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION, () => {
        gsap.set(node, { opacity: 1 });
      });

      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          node,
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out" },
        );
      });
    },
    { dependencies: [node] },
  );

  return (
    <div
      ref={setNode}
      className="page-enter-failsafe flex flex-1 flex-col"
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}
