export type FooterVariant = "light" | "dark";
export type FooterWaveColor = "white" | "beige" | "navy";

/** Routes whose footer uses the navy (dark) variant. */
const DARK_FOOTER_ROUTES = [
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

export function getFooterVariant(pathname: string): FooterVariant {
  const isDark = DARK_FOOTER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return isDark ? "dark" : "light";
}

/** Wave fill = the last content section's background, flowing into the footer.
 *  Dark footer pages use a navy wave so the blue footer edge cuts into the
 *  previous section. */
export function getFooterWaveColor(pathname: string): FooterWaveColor {
  if (getFooterVariant(pathname) === "dark") return "navy";
  if (pathname === "/about") return "beige";
  if (pathname === "/delivery") return "navy";
  return "white";
}
