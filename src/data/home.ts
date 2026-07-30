import type { Category, Dish, Review } from "@/types/content";

/**
 * Static placeholder content for the home page. Dish/category/review data will
 * come from the CMS later; the copy doc's real category list is preserved here.
 */

export const categories: Category[] = [
  { key: "grill", slug: "grill-and-mains" },
  { key: "burgers", slug: "burgers-and-sandwiches" },
  { key: "sushi", slug: "sushi-and-asian" },
  { key: "salads", slug: "salads-and-starters" },
  { key: "pizza", slug: "pizza-and-pasta" },
  { key: "drinks", slug: "cocktails-and-drinks" },
  { key: "desserts", slug: "desserts" },
];

export const popularDishes: Dish[] = [
  {
    slug: "ribeye-steak",
    categorySlug: "grill-and-mains",
    name: "Стейк Рібай",
    description: "Соковитий стейк на грилі з розмарином і морською сіллю.",
    price: 420,
    weight: 300,
    tag: "bestseller",
  },
  {
    slug: "happy-burger",
    categorySlug: "burgers-and-sandwiches",
    name: "Бургер Happy",
    description: "Мармурова яловичина, чеддер, соус на грилі, свіжі овочі.",
    price: 260,
    weight: 380,
    tag: "bestseller",
  },
  {
    slug: "california-set",
    categorySlug: "sushi-and-asian",
    name: "Сет Каліфорнія",
    description: "32 роли з лососем, крабом та авокадо. Ідеально для компанії.",
    price: 540,
    weight: 900,
    tag: "new",
  },
  {
    slug: "caesar-chicken",
    categorySlug: "salads-and-starters",
    name: "Цезар з куркою",
    description: "Хрустка романо, курка на грилі, пармезан, соус Цезар.",
    price: 210,
    weight: 280,
  },
  {
    slug: "margherita-pizza",
    categorySlug: "pizza-and-pasta",
    name: "Піца Маргарита",
    description: "Томати, моцарела фіор ді латте, свіжий базилік.",
    price: 230,
    weight: 450,
  },
  {
    slug: "tiramisu",
    categorySlug: "desserts",
    name: "Тірамісу",
    description: "Класичний італійський десерт з маскарпоне та кавою.",
    price: 140,
    weight: 160,
    tag: "new",
  },
];

export const promotions: Dish[] = [
  {
    slug: "grill-set-for-two",
    categorySlug: "grill-and-mains",
    name: "Гриль-сет для двох",
    description: "Асорті м'яса на грилі з овочами та соусами.",
    price: 690,
    oldPrice: 890,
    weight: 1200,
    tag: "discount",
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
  },
  {
    slug: "lunch-of-the-day",
    categorySlug: "salads-and-starters",
    name: "Ланч дня",
    description: "Суп, основна страва та напій за спеціальною ціною.",
    price: 180,
    oldPrice: 240,
    weight: 550,
    tag: "discount",
  },
];

export const reviews: Review[] = [
  {
    author: "Олена",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Смачно, порції щедрі, доставка вчасно. Стейк — просто вогонь!",
  },
  {
    author: "Андрій",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Замовляємо всім офісом. Завжди свіже й гаряче, сервіс на висоті.",
  },
  {
    author: "Марія",
    rating: 5,
    source: "Google",
    url: "https://maps.google.com",
    text: "Затишна атмосфера, до Happy справді хочеться повертатися.",
  },
];
