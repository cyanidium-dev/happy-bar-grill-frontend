/**
 * Localized `seoSettings` payload after GROQ resolves `{ uk, ru }` fields for
 * the active locale. Mirrors happy-bar-grill-admin `seoSettings`.
 */
export type PageSeoImage = {
  asset?: { _ref?: string; _type?: string } | null;
  alt?: string | null;
};

export type PageSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: PageSeoImage | null;
  /** CDN URL of an uploaded schema.org JSON file, if present. */
  schemaJsonUrl?: string | null;
};
