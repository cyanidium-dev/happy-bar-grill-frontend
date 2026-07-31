import { getTranslations } from "next-intl/server";
import AnimatedWrapper from "@/components/shared/animatedWrappers/AnimatedWrapper";
import Button from "@/components/shared/buttons/Button";
import CardMedia from "@/components/shared/cards/CardMedia";
import Chip from "@/components/shared/Chip";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import PageTitle from "@/components/shared/titles/PageTitle";

const heroImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80";

/**
 * Block 1 — first screen. States what you can order and pushes into the menu.
 * (Cart + language switcher live in the persistent Header — a layout concern.)
 *
 * Sits *behind* the fixed Header: a negative top margin cancels the page's
 * header-height padding so this section's own beige background reaches
 * the very top of the viewport (visible through the transparent header),
 * while a matching top padding keeps its content clear of the header bar.
 */
export default async function Hero() {
  const t = await getTranslations("HomePage.hero");

  const chips = [t("chips.delivery"), t("chips.portions"), t("chips.online")];

  return (
    <section
      className="relative overflow-hidden bg-beige"
      style={{
        marginTop: "calc(var(--header-height) * -1)",
        paddingTop: "var(--header-height)",
      }}
    >
      {/* Blue corner glow — echoes the site's navy brand colour, layered over
          the flat beige fill instead of baked into a diagonal gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8rem] top-[-6rem] size-[32rem] rounded-full bg-navy/15 blur-3xl"
      />
      {/* Decorative depth glow behind the dish photo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-6rem] top-1/4 size-[34rem] rounded-full bg-sand/25 blur-3xl"
      />
      <div className="container relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-20 xl:py-24">
        <AnimatedWrapper animation={{ x: -40 }} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="w-fit text-14semi uppercase tracking-[0.2em] text-red">
              {t("eyebrow")}
            </span>
            <PageTitle>{t("title")}</PageTitle>
          </div>
          <p className="max-w-xl text-16reg text-graphite xl:text-18reg">
            {t("description")}
          </p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip}>
                <Chip variant="glass">
                  <CheckIcon className="size-4 text-olive" />
                  {chip}
                </Chip>
              </li>
            ))}
          </ul>
          <Button href="/menu" size="lg" className="w-full sm:w-fit">
            {t("cta")}
          </Button>
        </AnimatedWrapper>

        <AnimatedWrapper animation={{ x: 40, delay: 0.15 }}>
          <CardMedia
            src={heroImage}
            alt={t("imageAlt")}
            className="aspect-[4/3] rounded-tl-2xl rounded-br-2xl shadow-card"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </AnimatedWrapper>
      </div>
    </section>
  );
}
