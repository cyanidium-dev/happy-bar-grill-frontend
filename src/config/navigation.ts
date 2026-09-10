/**
 * Primary navigation, shared by the header and footer.
 * `key` maps to a label under the `Nav` message namespace.
 */
export const navLinks = [
  { href: "/menu", key: "menu" },
  { href: "/delivery", key: "delivery" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
] as const;

export type NavLink = (typeof navLinks)[number];

/**
 * The app's personal screens. On phones these are the bottom navigation; the
 * footer repeats them above `lg`, where there is no bottom bar and they would
 * otherwise have no entry point at all.
 */
export const accountLinks = [
  { href: "/favorites", key: "favorites" },
  { href: "/orders", key: "orders" },
  { href: "/settings", key: "settings" },
] as const;
