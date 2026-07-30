import { Link } from "@/i18n/navigation";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Card from "@/components/shared/cards/Card";
import CardMedia from "@/components/shared/cards/CardMedia";

/** One category tile. Click opens the matching catalog section. */
export default function CategoryCard({
  slug,
  label,
  image,
  delay = 0,
}: {
  slug: string;
  label: string;
  image: string;
  delay?: number;
}) {
  return (
    <AnimatedWrapper as="li" animation={{ y: 24, delay }}>
      <Link href={`/menu/${slug}`} className="block">
        <Card interactive className="relative">
          <CardMedia
            src={image}
            alt={label}
            className="aspect-[4/3]"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
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
