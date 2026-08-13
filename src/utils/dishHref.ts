/** Dish page URL. Older cart/last-order snapshots may lack `categorySlug`. */
export function dishHref(item: { id: string; categorySlug?: string }): string {
  return item.categorySlug
    ? `/menu/${item.categorySlug}/${item.id}`
    : `/dish/${item.id}`;
}
