"use client";

import type { ReactNode } from "react";

/**
 * Wraps interactive elements inside a clickable <Link> card so their clicks
 * don't trigger the parent anchor navigation. Uses capture-phase stopPropagation
 * on the anchor click so the Link never fires, while the inner button's own
 * onClick still runs normally in the bubble phase before we swallow the event.
 */
export default function StopPropagationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      onClickCapture={(e) => {
        // Stop the click from reaching the ancestor <a> (Link),
        // but let it finish bubbling inside this subtree first so
        // QuickAddButton's own onClick fires normally.
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
