"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

type DishDescriptionProps = {
  text: string;
  showMoreLabel: string;
  showLessLabel: string;
  className?: string;
};

/**
 * Dish description clamped to 3 lines. Centers itself in whatever vertical
 * space is left under the title (up to the photo's bottom edge — the column
 * is stretched to match the photo height by the parent's `items-stretch`).
 *
 * When the text overflows 3 lines, a "show more" toggle smoothly expands the
 * block to reveal the rest. Height is measured in pixels (line-clamp itself
 * can't transition), using a hidden clamped twin purely for measurement, so
 * the visible paragraph never needs its clamp toggled mid-animation.
 */
export default function DishDescription({
  text,
  showMoreLabel,
  showLessLabel,
  className,
}: DishDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);

  const textRef = useRef<HTMLParagraphElement>(null);
  const clampRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const clampEl = clampRef.current;
    if (!textEl || !clampEl) return;

    const measure = () => {
      setCollapsedHeight(clampEl.clientHeight);
      setFullHeight(textEl.scrollHeight);
      setTruncated(clampEl.scrollHeight > clampEl.clientHeight + 1);
      setMeasured(true);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(textEl);
    observer.observe(clampEl);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className={cn("relative flex flex-1 flex-col justify-center gap-1", className)}>
      <div
        className={cn(
          "overflow-hidden",
          measured && "transition-[height] duration-300 ease-out",
        )}
        style={measured ? { height: expanded ? fullHeight : collapsedHeight } : undefined}
      >
        <p
          ref={textRef}
          className={cn(
            "text-14reg text-grey-dark",
            !measured && "line-clamp-3",
          )}
        >
          {text}
        </p>
      </div>

      {/* Hidden twin, same width and always clamped — measures the 3-line height only. */}
      <p
        ref={clampRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10 line-clamp-3 text-14reg"
      >
        {text}
      </p>

      {truncated && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="pointer-events-auto cursor-pointer self-start text-12med text-navy underline-offset-2 transition-colors duration-300 hover:underline"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}
