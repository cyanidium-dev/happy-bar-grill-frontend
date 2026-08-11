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

/** Start a fade after staggered card slide-ups (`duration` + last index * stagger). */
export function delayAfterCards(
  count: number,
  {
    duration = 0.6,
    stagger = 0.08,
  }: { duration?: number; stagger?: number } = {},
) {
  return duration + Math.max(0, count - 1) * stagger;
}

/** Opacity-only reveal — no `transform`, safe near `backdrop-filter` siblings. */
export function fadeIn(delay = 0, duration = 0.9): Animation {
  return { x: 0, y: 0, scale: 1, opacity: 0, delay, duration };
}
