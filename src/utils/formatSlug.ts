/**
 * Turns a URL slug into a human label, e.g. `hot-dishes` → `Hot Dishes`.
 * Temporary stand-in for CMS titles on dynamic pages (menu category, blog
 * article) until the data layer is wired up.
 */
export function formatSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
