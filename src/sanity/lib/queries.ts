import { defineQuery } from "next-sanity";

/** Pick the active locale from a bilingual `{ uk, ru }` field (falls back to uk → ru → raw). */
const localized = (field: string) =>
  /* groq */ `coalesce(${field}[$locale], ${field}.uk, ${field}.ru, ${field})`;

const dishFields = /* groq */ `
  "slug": slug.current,
  "categorySlug": category->slug.current,
  "name": ${localized("name")},
  "description": ${localized("description")},
  price,
  oldPrice,
  weight,
  tag,
  "image": image.asset->url
`;

export const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuCategory"] | order(order asc) {
    "slug": slug.current,
    "name": ${localized("name")},
    "image": image.asset->url
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "menuCategory" && slug.current == $slug][0] {
    "slug": slug.current,
    "name": ${localized("name")},
    "image": image.asset->url
  }
`);

export const ALL_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false] | order(order asc) {
    ${dishFields}
  }
`);

export const DISHES_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && category->slug.current == $slug]
    | order(order asc) {
      ${dishFields}
    }
`);

export const DISH_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && slug.current == $slug
    && category->slug.current == $category][0] {
    ${dishFields},
    "ingredients": ${localized("ingredients")},
    "gallery": gallery[]{
      "url": asset->url,
      "alt": ${localized("alt")}
    }
  }
`);

/**
 * Other dishes in the same category (for the "similar dishes" block), current
 * dish excluded. The detail page tops this up from popular dishes if a category
 * is thin.
 */
export const SIMILAR_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false
    && category->slug.current == $category
    && slug.current != $slug] | order(order asc) {
      ${dishFields}
    }
`);

/** Bestsellers for the homepage popular block. */
export const POPULAR_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && tag == "bestseller"]
    | order(order asc) [0...6] {
      ${dishFields}
    }
`);

/** Dishes flagged for the homepage hero (max 3). */
export const HERO_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && showOnHomepage == true]
    | order(order asc) [0...3] {
      ${dishFields}
    }
`);

/** Discount-tagged dishes for the homepage promotions block. */
export const PROMOTIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && tag == "discount"]
    | order(order asc) {
      ${dishFields}
    }
`);

/**
 * Menu catalog promo banner singleton (`menuPageBanner`). Mobile image falls
 * back to desktop when not set; alt prefers the required desktop field.
 */
export const MENU_PAGE_BANNER_QUERY = defineQuery(/* groq */ `
  *[_type == "menuPageBanner"][0] {
    "imageDesktop": imageDesktop.asset->url,
    "imageMobile": coalesce(imageMobile.asset->url, imageDesktop.asset->url),
    "alt": coalesce(
      ${localized("imageDesktop.alt")},
      ${localized("imageMobile.alt")}
    ),
    href
  }
`);
