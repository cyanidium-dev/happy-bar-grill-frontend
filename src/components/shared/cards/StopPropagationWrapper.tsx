"use client";

import type { ReactNode } from "react";

/**
 * Wraps interactive elements inside a clickable parent (e.g. a Link card)
 * so their click events don't bubble up and trigger the parent navigation.
 */
export default function StopPropagationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      onClick={(e) => e.preventDefault()}
      onClickCapture={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
