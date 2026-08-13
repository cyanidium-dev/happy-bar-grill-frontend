import type { CartLine } from "@/types/cart";

const SLUG_PART = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

/** Unique cart key: `categorySlug/dishSlug`. */
export function cartLineId(categorySlug: string, dishSlug: string): string {
  return `${categorySlug}/${dishSlug}`;
}

export function parseCartLineId(id: string): {
  categorySlug: string | null;
  slug: string;
} {
  const sep = id.indexOf("/");
  if (sep <= 0 || sep === id.length - 1) {
    return { categorySlug: null, slug: id };
  }
  const categorySlug = id.slice(0, sep);
  const slug = id.slice(sep + 1);
  if (!SLUG_PART.test(categorySlug) || !SLUG_PART.test(slug)) {
    return { categorySlug: null, slug: id };
  }
  return { categorySlug, slug };
}

export function dishSlugOf(item: { id: string; slug?: string }): string {
  return item.slug || parseCartLineId(item.id).slug;
}

/** Catalog → cart payload. `id` is namespaced by category so slugs can repeat. */
export function cartLineFromDish(dish: {
  slug: string;
  categorySlug: string;
  name: string;
  price: number;
  image: string;
  weight?: number;
}): CartLine {
  return {
    id: cartLineId(dish.categorySlug, dish.slug),
    slug: dish.slug,
    categorySlug: dish.categorySlug,
    name: dish.name,
    price: dish.price,
    image: dish.image,
    imageAlt: dish.name,
    weight: dish.weight,
  };
}
