import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import DishCard from "@/components/shared/cards/DishCard";
import type { Dish } from "@/types/content";

/**
 * Grid of dishes for the menu. Reuses the shared `DishCard`; each card reveals
 * on scroll. Shows an empty state when a category has no dishes.
 */
export default function DishesGrid({
  dishes,
  emptyLabel,
}: {
  dishes: Dish[];
  emptyLabel: string;
}) {
  if (dishes.length === 0) {
    return (
      <p className="py-16 text-center text-16reg text-grey-dark">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {dishes.map((dish, index) => (
        <AnimatedWrapper
          key={`${dish.categorySlug}-${dish.slug}`}
          as="li"
          animation={{ y: 24, delay: (index % 2) * 0.06 }}
          className="h-full"
        >
          <DishCard dish={dish} />
        </AnimatedWrapper>
      ))}
    </ul>
  );
}
