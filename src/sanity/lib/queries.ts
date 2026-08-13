import { defineQuery } from "next-sanity";

/** Pick the active locale from a bilingual `{ uk, ru }` field (falls back to uk → ru → raw). */
const localized = (field: string) =>
  /* groq */ `coalesce(${field}[$locale], ${field}.uk, ${field}.ru, ${field})`;

/**
 * Localized `seoSettings` projection. Text fields resolve to the active locale;
 * `opengraphImage` keeps the asset ref so the frontend can crop to 1200×630.
 */
export const SEO_SETTINGS_PROJECTION = /* groq */ `{
  "metaTitle": ${localized("metaTitle")},
  "metaDescription": ${localized("metaDescription")},
  "keywords": ${localized("keywords")},
  "opengraphTitle": ${localized("opengraphTitle")},
  "opengraphDescription": ${localized("opengraphDescription")},
  "opengraphImage": opengraphImage{
    ...,
    "alt": ${localized("alt")}
  },
  "schemaJsonUrl": schemaJson.asset->url
}`;

/** Fetch SEO block from a site singleton by fixed document `_id`. */
export const SITE_SEO_BY_DOCUMENT_ID = defineQuery(/* groq */ `
  *[_id == $documentId][0]{
    seo${SEO_SETTINGS_PROJECTION}
  }
`);

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
    "description": ${localized("description")},
    "image": image.asset->url,
    "seo": seo${SEO_SETTINGS_PROJECTION}
  }
`);

export const ALL_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false] | order(order asc) {
    ${dishFields}
  }
`);

/**
 * Canonical dish data for order placement. Prices/names come from Sanity so
 * the API never trusts the cart snapshot in localStorage. `nameUk` is always
 * Ukrainian for the kitchen Telegram message; `name` follows `$locale`.
 */
export const DISHES_BY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && slug.current in $slugs] {
    "slug": slug.current,
    "categorySlug": category->slug.current,
    "name": ${localized("name")},
    "nameUk": coalesce(name.uk, name.ru, name),
    price,
    weight,
    "image": image.asset->url
  }
`);

export const DISHES_BY_CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && category->slug.current == $slug]
    | order(order asc) {
      ${dishFields}
    }
`);

export const DISH_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && slug.current == $slug
    && category->slug.current == $category][0] {
    ${dishFields},
    calories,
    allergens,
    "ingredients": ${localized("ingredients")},
    "gallery": gallery[]{
      "url": asset->url,
      "alt": ${localized("alt")}
    },
    "seo": seo${SEO_SETTINGS_PROJECTION}
  }
`);

/** Resolve a dish permalink when the cart only has the dish slug (legacy last-order). */
export const DISH_PATH_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && slug.current == $slug][0] {
    "slug": slug.current,
    "categorySlug": category->slug.current
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

/** Dishes from categories flagged `upsell` (Допродажі) — checkout and dish page. */
export const UPSELL_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false && category->upsell == true]
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

/* --------------------------------- Blog ---------------------------------- */

/** Card fields shared by the blog list and the "other posts" block. */
const blogPreviewFields = /* groq */ `
  "slug": slug.current,
  "title": ${localized("heroTitle")},
  "description": ${localized("heroDescription")},
  "image": heroMobileImage.asset->url,
  "imageAlt": ${localized("heroMobileImage.alt")},
  "createdAt": _createdAt,
  "author": author->{ "name": ${localized("name")} }
`;

export const ALL_BLOG_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(_createdAt desc) {
    ${blogPreviewFields}
  }
`);

/** Full article. Localized Portable Text (`content`) keeps raw image asset refs
 *  so the Portable Text image serializer can build URLs client-side. */
export const BLOG_POST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    "slug": slug.current,
    "title": ${localized("heroTitle")},
    "description": ${localized("heroDescription")},
    "imageDesktop": heroDesktopImage.asset->url,
    "imageDesktopAlt": ${localized("heroDesktopImage.alt")},
    "imageMobile": heroMobileImage.asset->url,
    "imageMobileAlt": ${localized("heroMobileImage.alt")},
    "createdAt": _createdAt,
    "content": coalesce(content[$locale], content.uk, content.ru),
    "faq": customFaq[]{
      _key,
      "question": ${localized("question")},
      "answer": coalesce(answer[$locale], answer.uk, answer.ru)
    },
    "author": author->{
      "name": ${localized("name")},
      "photo": photo.asset->url,
      "photoAlt": ${localized("photo.alt")},
      profileUrl
    },
    "seo": seo${SEO_SETTINGS_PROJECTION}
  }
`);

/** Slugs for `generateStaticParams` on the article route. */
export const BLOG_POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current)].slug.current
`);

/* ------------------------------- Sitemap -------------------------------- */

export const SITEMAP_CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuCategory" && defined(slug.current)] | order(order asc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`);

export const SITEMAP_DISHES_QUERY = defineQuery(/* groq */ `
  *[_type == "menuDish" && available != false
    && defined(slug.current)
    && defined(category->slug.current)] | order(order asc) {
    "slug": slug.current,
    "categorySlug": category->slug.current,
    "updatedAt": _updatedAt
  }
`);

export const SITEMAP_BLOG_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`);
