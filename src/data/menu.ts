import { cache } from "react";
import { getLocale } from "next-intl/server";
import type { Category, Dish } from "@/types/content";
import { routing, type Locale } from "@/i18n/routing";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ALL_DISHES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  DISH_BY_SLUG_QUERY,
  DISHES_BY_CATEGORY_QUERY,
  HERO_DISHES_QUERY,
  POPULAR_DISHES_QUERY,
  PROMOTIONS_QUERY,
  SIMILAR_DISHES_QUERY,
} from "@/sanity/lib/queries";

/**
 * Menu data access layer.
 *
 * Components call these accessors and never touch Sanity queries directly.
 * Localized CMS fields (`name`, `description`) are resolved to the active
 * request locale inside GROQ via `$locale`.
 */

export type MenuBanner = {
  /** Wide promo image (comes from the admin panel later). */
  imageMobile: string;
  imageDesktop: string;
  /** Optional click-through target for the banner. */
  href?: string;
};

const menuBanner: MenuBanner = {
  imageDesktop:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  imageMobile:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
};

export function getMenuBanner(): MenuBanner {
  return menuBanner;
}

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

/**
 * Dishes for the "similar dishes" block on a dish page: same category, current
 * dish excluded, capped at `limit`. Tops up from popular dishes when a category
 * is too thin to fill the row.
 */
export const getSimilarDishes = cache(
  async (
    category: string,
    excludeSlug: string,
    locale?: Locale,
    limit = 4,
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

export const getPromotions = cache(async (locale?: Locale): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: PROMOTIONS_QUERY,
    params: await localeParams({}, locale),
    tags: ["menuDish"],
  });
});
