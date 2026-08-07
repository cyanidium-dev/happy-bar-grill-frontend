import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Floating food props reused from the home page decorations. Desktop-only,
 * clipped by the parent section — pure atmosphere behind the menu grid.
 * The bottom tomato lives under the sticky category sidebar in `CategoryNav`.
 */
export default async function MenuDecorations() {
  const t = await getTranslations("Menu.alts");

  return (
    <div className="pointer-events-none absolute top-[100px] right-[-56px] hidden h-[168px] w-[150px] lg:block xl:top-[140px] xl:right-[-80px] xl:h-[200px] xl:w-[178px]">
      <Image
        src="/images/home/promotions/tomato-top.webp"
        alt={t("tomatoTop")}
        fill
        className="object-contain -rotate-90 -scale-y-100"
        sizes="178px"
      />
    </div>
  );
}
