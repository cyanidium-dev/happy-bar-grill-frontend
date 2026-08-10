export type FooterVariant = "light" | "dark";
export type FooterWaveColor = "white" | "beige" | "navy";

/** Routes whose footer uses the navy (dark) variant. */
const DARK_FOOTER_ROUTES = [
  "/contacts",
  "/menu",
  "/blog",
  "/privacy",
  "/offer",
] as const;

export function getFooterVariant(pathname: string): FooterVariant {
  const isDark = DARK_FOOTER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return isDark ? "dark" : "light";
}

/** Wave fill = the last content section's background, flowing into the footer. */
export function getFooterWaveColor(pathname: string): FooterWaveColor {
  if (pathname === "/about") return "beige";
  if (pathname === "/delivery") return "navy";
  return "white";
}
