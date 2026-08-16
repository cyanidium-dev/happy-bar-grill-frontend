/** Virtual menu category for dishes tagged `discount` (Акція) in Sanity. */
export const SPECIAL_OFFERS_SLUG = "special-offers";

/** Anchor for the menu catalog (`MenuView`) — category nav scrolls here. */
export const MENU_CATALOG_ID = "menu-catalog";

/** sessionStorage flag set by category nav before soft-navigating. */
export const MENU_SCROLL_FLAG = "scrollToMenuCatalog";

/**
 * Marks a category block on the full catalog, so the chip strip can tell which
 * one is on screen and scroll to it.
 *
 * Lives here rather than beside the scroll-spy: that module is `"use client"`,
 * and a server component importing a value from it receives a client-module
 * reference instead of the string.
 */
export const MENU_SECTION_ATTR = "data-menu-section";

/** Price-filter slider (UAH). Max comes from the dishes in the catalog. */
export const PRICE_FILTER_MIN = 0;
export const PRICE_FILTER_STEP = 10;
