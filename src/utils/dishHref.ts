import { dishSlugOf } from "@/utils/cartLine";

/** Dish page URL. Older cart/last-order snapshots may lack `categorySlug`. */
export function dishHref(item: {
  id: string;
  slug?: string;
  categorySlug?: string;
}): string {
  const slug = dishSlugOf(item);
  return item.categorySlug
    ? `/menu/${item.categorySlug}/${slug}`
    : `/dish/${slug}`;
}
