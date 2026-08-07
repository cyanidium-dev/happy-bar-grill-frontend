import { cache } from "react";
import type { Category, Dish } from "@/types/content";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ALL_DISHES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  DISHES_BY_CATEGORY_QUERY,
  HERO_DISHES_QUERY,
  POPULAR_DISHES_QUERY,
  PROMOTIONS_QUERY,
} from "@/sanity/lib/queries";

/**
 * Menu data access layer.
 *
 * Components call these accessors and never touch Sanity queries directly.
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

export const getCategories = cache(async (): Promise<Category[]> => {
  return sanityFetch<Category[]>({
    query: CATEGORIES_QUERY,
    tags: ["menuCategory"],
  });
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    return sanityFetch<Category | null>({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug },
      tags: ["menuCategory", `menuCategory:${slug}`],
    });
  },
);

export const getAllDishes = cache(async (): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: ALL_DISHES_QUERY,
    tags: ["menuDish"],
  });
});

export const getDishesByCategory = cache(
  async (slug: string): Promise<Dish[]> => {
    return sanityFetch<Dish[]>({
      query: DISHES_BY_CATEGORY_QUERY,
      params: { slug },
      tags: ["menuDish", `menuCategory:${slug}`],
    });
  },
);

export const getPopularDishes = cache(async (): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: POPULAR_DISHES_QUERY,
    tags: ["menuDish"],
  });
});

export const getHeroDishes = cache(async (): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: HERO_DISHES_QUERY,
    tags: ["menuDish"],
  });
});

export const getPromotions = cache(async (): Promise<Dish[]> => {
  return sanityFetch<Dish[]>({
    query: PROMOTIONS_QUERY,
    tags: ["menuDish"],
  });
});
