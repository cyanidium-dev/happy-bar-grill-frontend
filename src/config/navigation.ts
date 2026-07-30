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
