import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { SPECIAL_OFFERS_SLUG } from "@/constants/menu";
import type { Category, Dish } from "@/types/content";
import { routing, type Locale } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ALL_DISHES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  DISH_BY_SLUG_QUERY,
  DISH_PATH_BY_SLUG_QUERY,
  DISHES_BY_CATEGORY_QUERY,
  HERO_DISHES_QUERY,
  MENU_PAGE_BANNER_QUERY,
  POPULAR_DISHES_QUERY,
  PROMOTIONS_QUERY,
  SIMILAR_DISHES_QUERY,
  UPSELL_DISHES_QUERY,
} from "@/sanity/lib/queries";

/**
 * Menu data access layer.
 *
 * Components call these accessors and never touch Sanity queries directly.
 * Localized CMS fields (`name`, `description`) are resolved to the active
 * request locale inside GROQ via `$locale`.
 */

export type MenuBanner = {
  imageMobile: string;
  imageDesktop: string;
  /** Locale-resolved alt from Sanity (`imageDesktop.alt` / `imageMobile.alt`). */
  alt: string;
  /** Optional click-through: relative path or absolute URL. */
  href?: string | null;
};

export const getMenuBanner = cache(
  async (locale?: Locale): Promise<MenuBanner | null> => {
    const banner = await sanityFetch<MenuBanner | null>({
      query: MENU_PAGE_BANNER_QUERY,
      params: await localeParams({}, locale),
      tags: ["menuPageBanner"],
    });

    if (!banner?.imageDesktop) return null;
    return banner;
  },
);

async function resolveLocale(override?: Locale): Promise<Locale> {
  if (override) return override;
  try {
    return (await getLocale()) as Locale;
  } catch {
    return routing.defaultLocale;
  }
}

async function localeParams(
  extra: Record<string, string> = {},
  localeOverride?: Locale,
) {
  return { locale: await resolveLocale(localeOverride), ...extra };
}

export const getCategories = cache(
  async (locale?: Locale): Promise<Category[]> => {
    return sanityFetch<Category[]>({
      query: CATEGORIES_QUERY,
      params: await localeParams({}, locale),
      tags: ["menuCategory"],
    });
  },
);

export const getCategoryBySlug = cache(
  async (slug: string, locale?: Locale): Promise<Category | null> => {
    // Virtual category: discount-tagged dishes stay in their food categories
    // in Sanity and are also listed here via PROMOTIONS_QUERY.
    if (slug === SPECIAL_OFFERS_SLUG) {
      const resolved = await resolveLocale(locale);
      const t = await getTranslations({ locale: resolved, namespace: "Menu" });
      return {
        slug: SPECIAL_OFFERS_SLUG,
        name: t("specialOffers"),
        image: "",
      };
    }

    return sanityFetch<Category | null>({
      query: CATEGORY_BY_SLUG_QUERY,
      params: await localeParams({ slug }, locale),
      tags: ["menuCategory", `menuCategory:${slug}`],
    });
  },
);

export const getAllDishes = cache(async (locale?: Locale): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: ALL_DISHES_QUERY,
    params: await localeParams({}, locale),
    tags: ["menuDish"],
  });
});

export const getDishesByCategory = cache(
  async (slug: string, locale?: Locale): Promise<Dish[]> => {
    if (slug === SPECIAL_OFFERS_SLUG) {
      return getPromotions(locale);
    }

    return sanityFetch<Dish[]>({
      query: DISHES_BY_CATEGORY_QUERY,
      params: await localeParams({ slug }, locale),
      tags: ["menuDish", `menuCategory:${slug}`],
    });
  },
);

export const getDishBySlug = cache(
  async (
    category: string,
    slug: string,
    locale?: Locale,
  ): Promise<Dish | null> => {
    return sanityFetch<Dish | null>({
      query: DISH_BY_SLUG_QUERY,
      params: await localeParams({ category, slug }, locale),
      tags: ["menuDish", `menuDish:${slug}`, `menuCategory:${category}`],
    });
  },
);

/** Canonical `/menu/[category]/[dish]` segments when only the dish slug is known. */
export const getDishPathBySlug = cache(
  async (
    slug: string,
    locale?: Locale,
  ): Promise<{ slug: string; categorySlug: string } | null> => {
    return sanityFetch<{ slug: string; categorySlug: string } | null>({
      query: DISH_PATH_BY_SLUG_QUERY,
      params: await localeParams({ slug }, locale),
      tags: ["menuDish", `menuDish:${slug}`],
    });
  },
);

/**
 * Dishes for the "similar dishes" block on a dish page: same category, current
 * dish excluded, capped at `limit`. Tops up from popular dishes when a category
 * is too thin to fill the carousel.
 */
export const getSimilarDishes = cache(
  async (
    category: string,
    excludeSlug: string,
    locale?: Locale,
    limit = 6,
  ): Promise<Dish[]> => {
    const resolved = await resolveLocale(locale);
    const similar = await sanityFetch<Dish[]>({
      query: SIMILAR_DISHES_QUERY,
      params: { locale: resolved, category, slug: excludeSlug },
      tags: ["menuDish", `menuCategory:${category}`],
    });
    if (similar.length >= limit) return similar.slice(0, limit);

    // Thin category — top up from popular dishes, skipping the current dish
    // and anything already listed.
    const popular = await getPopularDishes(resolved);
    const seen = new Set([excludeSlug, ...similar.map((dish) => dish.slug)]);
    const topUp = popular.filter((dish) => !seen.has(dish.slug));
    return [...similar, ...topUp].slice(0, limit);
  },
);

export const getPopularDishes = cache(
  async (locale?: Locale): Promise<Dish[]> => {
    return sanityFetch<Dish[]>({
      query: POPULAR_DISHES_QUERY,
      params: await localeParams({}, locale),
      tags: ["menuDish"],
    });
  },
);

export const getHeroDishes = cache(async (locale?: Locale): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: HERO_DISHES_QUERY,
    params: await localeParams({}, locale),
    tags: ["menuDish"],
  });
});

/** Dishes from `upsell`-flagged categories (Допродажі) — checkout and dish page. */
export const getUpsellDishes = cache(
  async (locale?: Locale): Promise<Dish[]> => {
    return sanityFetch<Dish[]>({
      query: UPSELL_DISHES_QUERY,
      params: await localeParams({}, locale),
      tags: ["menuDish", "menuCategory"],
    });
  },
);

export const getPromotions = cache(async (locale?: Locale): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: PROMOTIONS_QUERY,
    params: await localeParams({}, locale),
    tags: ["menuDish"],
  });
});
