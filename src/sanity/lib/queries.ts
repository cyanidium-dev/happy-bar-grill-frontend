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
