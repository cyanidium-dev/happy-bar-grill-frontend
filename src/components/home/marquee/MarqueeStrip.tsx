import { getTranslations } from "next-intl/server";
import Marquee from "@/components/shared/motion/Marquee";

/**
 * Navy ticker strip. Sits between two white sections as a divider that earns
 * its space by moving. Purely decorative — the phrases repeat what the menu
 * and delivery sections already say.
 */
export default async function MarqueeStrip() {
  const t = await getTranslations("HomePage.marquee");
  const items = t("items")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="relative bg-navy-dark py-4 text-white xl:py-6">
      <Marquee items={items} />
    </div>
  );
}
