import type { Category, Dish } from "@/types/content";
import { categories } from "@/data/home";

/**
 * Menu data access layer.
 *
 * Components call these accessors and never touch the source directly, so when
 * the admin panel (Sanity) is wired up we only swap the bodies here — the UI
 * stays the same. For now everything is static placeholder content.
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

// Placeholder catalog until the CMS provides real dishes. Reuses the same
// (valid) Unsplash images already used elsewhere on the site.
const menuDishes: Dish[] = [
  // Гриль та основні страви
  {
    slug: "ribeye-steak",
    categorySlug: "grill-and-mains",
    name: "Стейк Рібай",
    description: "Соковитий стейк на грилі з розмарином і морською сіллю.",
    price: 420,
    weight: 300,
    tag: "bestseller",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  },
  {
    slug: "bbq-pork-ribs",
    categorySlug: "grill-and-mains",
    name: "Свинячі ребра BBQ",
    description: "Ніжні ребра в димному соусі BBQ, повільного приготування.",
    price: 380,
    weight: 450,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  },
  {
    slug: "grilled-chicken-fillet",
    categorySlug: "grill-and-mains",
    name: "Куряче філе на грилі",
    description: "Мариноване куряче філе з овочами-гриль.",
    price: 240,
    weight: 320,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  },

  // Бургери та сендвічі
  {
    slug: "happy-burger",
    categorySlug: "burgers-and-sandwiches",
    name: "Бургер Happy",
    description: "Мармурова яловичина, чеддер, соус на грилі, свіжі овочі.",
    price: 260,
    weight: 380,
    tag: "bestseller",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    slug: "classic-cheeseburger",
    categorySlug: "burgers-and-sandwiches",
    name: "Чізбургер Класик",
    description: "Соковита котлета, подвійний чеддер, маринований огірок.",
    price: 220,
    weight: 340,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
  },
  {
    slug: "club-sandwich",
    categorySlug: "burgers-and-sandwiches",
    name: "Клаб-сендвіч",
    description: "Курка, бекон, яйце, томати й хрусткий тост у три шари.",
    price: 190,
    weight: 300,
    tag: "new",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
  },

  // Суші та азійська кухня
  {
    slug: "california-set",
    categorySlug: "sushi-and-asian",
    name: "Сет Каліфорнія",
    description: "32 роли з лососем, крабом та авокадо. Ідеально для компанії.",
    price: 540,
    weight: 900,
    tag: "new",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
  },
  {
    slug: "philadelphia-roll",
    categorySlug: "sushi-and-asian",
    name: "Філадельфія",
    description: "Класичні роли з лососем і вершковим сиром.",
    price: 320,
    weight: 280,
    tag: "bestseller",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
  },
  {
    slug: "wok-noodles-chicken",
    categorySlug: "sushi-and-asian",
    name: "Локшина WOK з куркою",
    description: "Локшина у соусі теріякі з овочами й куркою.",
    price: 210,
    weight: 400,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
  },

  // Салати та закуски
  {
    slug: "caesar-chicken",
    categorySlug: "salads-and-starters",
    name: "Цезар з куркою",
    description: "Хрустка романо, курка на грилі, пармезан, соус Цезар.",
    price: 210,
    weight: 280,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
  },
  {
    slug: "greek-salad",
    categorySlug: "salads-and-starters",
    name: "Грецький салат",
    description: "Свіжі овочі, фета, оливки та оливкова олія.",
    price: 180,
    weight: 260,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    slug: "cheese-platter",
    categorySlug: "salads-and-starters",
    name: "Сирна тарілка",
    description: "Асорті сирів з медом, горіхами та виноградом.",
    price: 320,
    weight: 220,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },

  // Піца та паста
  {
    slug: "margherita-pizza",
    categorySlug: "pizza-and-pasta",
    name: "Піца Маргарита",
    description: "Томати, моцарела фіор ді латте, свіжий базилік.",
    price: 230,
    weight: 450,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80",
  },
  {
    slug: "pasta-carbonara",
    categorySlug: "pizza-and-pasta",
    name: "Паста Карбонара",
    description: "Спагеті, бекон, вершковий соус і пармезан.",
    price: 250,
    weight: 380,
    tag: "bestseller",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  },
  {
    slug: "family-pizza-combo",
    categorySlug: "pizza-and-pasta",
    name: "Сімейне комбо піц",
    description: "Дві великі піци на ваш вибір + напої у подарунок.",
    price: 450,
    oldPrice: 560,
    weight: 1600,
    tag: "discount",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  },

  // Коктейлі та напої
  {
    slug: "aperol-spritz",
    categorySlug: "cocktails-and-drinks",
    name: "Апероль Шприц",
    description: "Апероль, просекко, содова та часточка апельсина.",
    price: 180,
    weight: 300,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  },
  {
    slug: "mojito",
    categorySlug: "cocktails-and-drinks",
    name: "Мохіто",
    description: "Лайм, мʼята, білий ром і содова з льодом.",
    price: 160,
    weight: 350,
    tag: "new",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  },
  {
    slug: "homemade-lemonade",
    categorySlug: "cocktails-and-drinks",
    name: "Домашній лимонад",
    description: "Освіжний лимонад на вибір: цитрус, ягоди чи мʼята.",
    price: 90,
    weight: 400,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  },

  // Десерти
  {
    slug: "tiramisu",
    categorySlug: "desserts",
    name: "Тірамісу",
    description: "Класичний італійський десерт з маскарпоне та кавою.",
    price: 140,
    weight: 160,
    tag: "new",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  },
  {
    slug: "new-york-cheesecake",
    categorySlug: "desserts",
    name: "Чізкейк Нью-Йорк",
    description: "Ніжний вершковий чізкейк на пісочній основі.",
    price: 150,
    weight: 180,
    tag: "bestseller",
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80",
  },
  {
    slug: "chocolate-fondant",
    categorySlug: "desserts",
    name: "Шоколадний фондан",
    description: "Теплий шоколадний кекс із рідкою серединкою.",
    price: 160,
    weight: 150,
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80",
  },
];

export function getMenuBanner(): MenuBanner {
  return menuBanner;
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllDishes(): Dish[] {
  return menuDishes;
}

export function getDishesByCategory(slug: string): Dish[] {
  return menuDishes.filter((dish) => dish.categorySlug === slug);
}
