"use client";

import { useState, type ReactNode } from "react";
import { DESKTOP_HOVER, FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Leans a card towards the pointer.
 *
 * Perspective sits on the outer element and the rotation on the inner one —
 * an element cannot apply perspective to its own transform, so the two have
 * to be separate nodes.
 *
 * Desktop pointers only. There is no sensible touch equivalent, and the
 * effect is pure decoration, so coarse pointers simply get nothing.
 */
export default function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum lean in degrees at the card's edge. */
  max?: number;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!node) return;

      const mm = gsap.matchMedia();

      mm.add(`${FULL_MOTION} and ${DESKTOP_HOVER}`, () => {
        // quickTo keeps one tween alive per axis instead of spawning a new
        // one on every pointermove.
        const toY = gsap.quickTo(node, "rotationY", {
          duration: 0.5,
          ease: "power3",
        });
        const toX = gsap.quickTo(node, "rotationX", {
          duration: 0.5,
          ease: "power3",
        });

        const onMove = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          toY(x * max * 2);
          toX(-y * max * 2);
        };

        const onLeave = () => {
          toY(0);
          toX(0);
        };

        node.addEventListener("pointermove", onMove);
        node.addEventListener("pointerleave", onLeave);

        return () => {
          node.removeEventListener("pointermove", onMove);
          node.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { dependencies: [node] },
  );

  return (
    <div className={className} style={{ perspective: "700px" }}>
      <div ref={setNode} className="h-full">
        {children}
      </div>
    </div>
  );
}
