/** Placeholder content types. These mirror the shape the CMS will return. */

export type DishTag = "bestseller" | "new" | "discount";

export type Dish = {
  slug: string;
  categorySlug: string;
  name: string;
  description: string;
  /** Price in UAH. */
  price: number;
  /** Previous price (promotions), shown struck through. */
  oldPrice?: number;
  /** Weight in grams. */
  weight: number;
  tag?: DishTag;
  /** Stock photo URL (placeholder until the CMS provides real photography). */
  image: string;
};

export type Category = {
  /** i18n key under `HomePage.categories.items`. */
  key: string;
  /** Route segment: `/menu/[slug]`. */
  slug: string;
  /** Stock photo URL (placeholder until the CMS provides real photography). */
  image: string;
};

export type Review = {
  author: string;
  /** Reviewer's photo (placeholder until the CMS provides real avatars). */
  avatar: string;
  /** 1–5. */
  rating: number;
  source: string;
  url: string;
  text: string;
};
