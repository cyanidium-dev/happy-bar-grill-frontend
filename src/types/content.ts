/**
 * Content types shaped to match Sanity `menuDish` / `menuCategory` projections.
 * Localized CMS fields (`name`, `description`) arrive already resolved to the
 * active locale string by GROQ (`coalesce(...[$locale], ...)`).
 */

export type DishTag = "bestseller" | "new" | "discount";

/** EU 1169/2011 allergen codes stored on Sanity `menuDish.allergens`. */
export type Allergen =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export const ALLERGENS: readonly Allergen[] = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
];

/** A gallery photo with its own locale-resolved alt text. */
export type GalleryImage = {
  url: string;
  alt: string;
};

export type Dish = {
  slug: string;
  categorySlug: string;
  name: string;
  description: string;
  /** Price in UAH. */
  price: number;
  /** Previous price (promotions), shown struck through. */
  oldPrice?: number | null;
  /** Weight in grams. */
  weight: number;
  /**
   * Energy value of the portion in kcal (Sanity `calories`). Only the
   * `DISH_BY_SLUG_QUERY` projects this — catalog/card queries omit it.
   */
  calories?: number | null;
  /**
   * EU allergen codes present in the dish (Sanity `allergens`). Only the
   * `DISH_BY_SLUG_QUERY` projects this — catalog/card queries omit it.
   */
  allergens?: Allergen[] | null;
  tag?: DishTag | null;
  /** Card/catalog thumbnail URL from Sanity CDN. */
  image: string;
  /**
   * Extra photos for the dish detail page (Sanity `gallery` field). Only the
   * `DISH_BY_SLUG_QUERY` projects this — catalog/card queries omit it.
   */
  gallery?: GalleryImage[];
  /**
   * Dish composition/ingredients list (Sanity `ingredients` field). Only the
   * `DISH_BY_SLUG_QUERY` projects this — catalog/card queries omit it.
   */
  ingredients?: string;
};

export type Category = {
  /** Display name from CMS. */
  name: string;
  /** Route segment: `/menu/[slug]`. */
  slug: string;
  /** Image URL from Sanity CDN. */
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
