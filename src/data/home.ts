import type { Review } from "@/types/content";

/**
 * Static placeholder content still waiting on the CMS (reviews).
 * Dishes and categories are fetched from Sanity via `@/data/menu`.
 */

export const reviews: Review[] = [
  {
    author: "Олена",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&q=80&fit=crop&crop=faces",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Смачно, порції щедрі, доставка вчасно. Стейк — просто вогонь!",
  },
  {
    author: "Андрій",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&q=80&fit=crop&crop=faces",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Замовляємо всім офісом. Завжди свіже й гаряче, сервіс на висоті.",
  },
  {
    author: "Марія",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&q=80&fit=crop&crop=faces",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Затишна атмосфера, до Happy справді хочеться повертатися.",
  },
];
