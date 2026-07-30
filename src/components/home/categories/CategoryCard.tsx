import { Link } from "@/i18n/navigation";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Card from "@/components/shared/cards/Card";
import ImagePlaceholder from "@/components/shared/media/ImagePlaceholder";

/** One category tile. Click opens the matching catalog section. */
export default function CategoryCard({
  slug,
  label,
  delay = 0,
}: {
  slug: string;
  label: string;
  delay?: number;
}) {
  return (
    <AnimatedWrapper as="li" animation={{ y: 24, delay }}>
      <Link href={`/menu/${slug}`} className="block">
        <Card interactive className="relative">
          {/* Decorative placeholder — the label is rendered in the overlay below. */}
          <ImagePlaceholder className="aspect-[4/3]" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/80 via-navy/20 to-transparent p-4">
            <h3 className="font-display text-20semi uppercase text-white xl:text-24semi">
              {label}
            </h3>
          </div>
        </Card>
      </Link>
    </AnimatedWrapper>
  );
}
