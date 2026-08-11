export type FooterVariant = "light" | "dark";
export type FooterWaveColor = "white" | "beige" | "navy";

/** Routes whose footer uses the navy (dark) variant. */
const DARK_FOOTER_ROUTES = [
  "/about",
  "/contacts",
  "/menu",
  "/blog",
  "/privacy",
  "/offer",
  "/checkout",
  "/confirmation",
] as const;

/**
 * Height of the footer’s overlapping top wave (`SectionWave` with `above`).
 * Last-section bottom padding must clear this so content isn’t covered.
 */
export const FOOTER_WAVE_HEIGHT_CLASS =
  "h-[44px] md:h-[72px] xl:h-[96px]" as const;

/** Dish detail: `/menu/:category/:dish` — light footer like home. */
export function isDishDetailPath(pathname: string): boolean {
  return /^\/menu\/[^/]+\/[^/]+\/?$/.test(pathname);
}

/**
 * Home and dish pages pull the light footer up so its absolute white wave
 * overlaps the last section (see Footer `-mt-18` + last-section padding).
 */
export function hasOverlappingLightFooter(pathname: string): boolean {
  return pathname === "/" || isDishDetailPath(pathname);
}

export function getFooterVariant(pathname: string): FooterVariant {
  // Dish pages sit under `/menu/...` but use the light (white) footer.
  if (isDishDetailPath(pathname)) return "light";

  const isDark = DARK_FOOTER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return isDark ? "dark" : "light";
}

/** Wave fill for the footer's overlapping top wave.
 *  Dark footer → navy; light footer (incl. home, delivery, dish) → white. */
export function getFooterWaveColor(pathname: string): FooterWaveColor {
  if (getFooterVariant(pathname) === "dark") return "navy";
  return "white";
}
