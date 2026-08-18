import { Link } from "@/i18n/navigation";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Card from "@/components/shared/cards/Card";
import CardMedia from "@/components/shared/cards/CardMedia";
import Tilt from "@/components/shared/motion/Tilt";

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
    <AnimatedWrapper
      as="li"
      animation={{ y: 24, delay }}
      className="xl:hover:z-10"
    >
      <Link href={`/menu/${slug}`} className="block">
        <Tilt>
          <Card
            interactive
            className="relative xl:hover:shadow-category-hover!"
          >
            <CardMedia
              src={image}
              alt={label}
              className="aspect-[4/3]"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-colors duration-300 xl:group-hover:from-black/85" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 py-1 lg:p-4">
              <h3 className="font-findsans text-12semi lg:text-18semi uppercase text-white transition-transform duration-300 xl:group-hover:-translate-y-0.5">
                {label}
              </h3>
              <span
                aria-hidden
                className="h-0.5 w-16 origin-left scale-x-0 rounded-full bg-red transition-transform duration-300 xl:group-hover:scale-x-100"
              />
            </div>
          </Card>
        </Tilt>
      </Link>
    </AnimatedWrapper>
  );
}
