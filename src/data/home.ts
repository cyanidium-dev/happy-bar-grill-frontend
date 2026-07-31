import type { Category, Dish, Review } from "@/types/content";

/**
 * Static placeholder content for the home page. Dish/category/review data will
 * come from the CMS later; the copy doc's real category list is preserved here.
 */

export const categories: Category[] = [
  {
    key: "grill",
    slug: "grill-and-mains",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  },
  {
    key: "burgers",
    slug: "burgers-and-sandwiches",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
  },
  {
    key: "sushi",
    slug: "sushi-and-asian",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
  },
  {
    key: "salads",
    slug: "salads-and-starters",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    key: "pizza",
    slug: "pizza-and-pasta",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  },
  {
    key: "drinks",
    slug: "cocktails-and-drinks",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  },
  {
    key: "desserts",
    slug: "desserts",
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80",
  },
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
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  },
  {
    slug: "happy-burger",
    categorySlug: "burgers-and-sandwiches",
    name: "Бургер Happy",
    description: "Мармурова яловичина, чеддер, соус на грилі, свіжі овочі.",
    price: 260,
    weight: 380,
    tag: "bestseller",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    slug: "california-set",
    categorySlug: "sushi-and-asian",
    name: "Сет Каліфорнія",
    description: "32 роли з лососем, крабом та авокадо. Ідеально для компанії.",
    price: 540,
    weight: 900,
    tag: "new",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
  },
  {
    slug: "caesar-chicken",
    categorySlug: "salads-and-starters",
    name: "Цезар з куркою",
    description: "Хрустка романо, курка на грилі, пармезан, соус Цезар.",
    price: 210,
    weight: 280,
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
  },
  {
    slug: "margherita-pizza",
    categorySlug: "pizza-and-pasta",
    name: "Піца Маргарита",
    description: "Томати, моцарела фіор ді латте, свіжий базилік.",
    price: 230,
    weight: 450,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80",
  },
  {
    slug: "tiramisu",
    categorySlug: "desserts",
    name: "Тірамісу",
    description: "Класичний італійський десерт з маскарпоне та кавою.",
    price: 140,
    weight: 160,
    tag: "new",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  },
];

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
