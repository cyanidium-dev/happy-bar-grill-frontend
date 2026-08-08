"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { MENU_CATALOG_ID, MENU_SCROLL_FLAG } from "@/constants/menu";

/**
 * After a category-nav soft navigation, scroll to the catalog section instead
 * of leaving the viewport at the page top (banner / breadcrumbs).
 */
export default function MenuCatalogScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (sessionStorage.getItem(MENU_SCROLL_FLAG) !== "1") return;
    sessionStorage.removeItem(MENU_SCROLL_FLAG);
    document
      .getElementById(MENU_CATALOG_ID)
      ?.scrollIntoView({ block: "start" });
  }, [pathname]);

  return null;
}
