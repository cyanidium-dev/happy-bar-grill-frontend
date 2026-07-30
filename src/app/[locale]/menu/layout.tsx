import type { ReactNode } from "react";

/**
 * Shared shell for the menu section. The sticky category navigation, the filter
 * panel and the cart context will live here later so they persist across
 * `/menu` and `/menu/[category]`. For now it just forwards its children.
 */
export default function MenuLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
