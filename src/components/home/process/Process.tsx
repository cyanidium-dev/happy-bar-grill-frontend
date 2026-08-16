import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import Button from "@/components/shared/buttons/Button";
import ProcessTrack from "@/components/home/process/ProcessTrack";
import Section from "@/components/shared/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";

// Same icon language as DeliverySteps: 24px box, 1.8 stroke, round joins.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons: Record<string, ReactNode> = {
  choose: (
    <svg {...iconProps} className="size-7">
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </svg>
  ),
  grill: (
    <svg {...iconProps} className="size-7">
      <path d="M4 10h16M6 10a6 6 0 0 1 12 0" />
      <path d="M7 14v4M12 14v5M17 14v4" />
      <path d="M9 6.5c0-1 1-1.4 1-2.5M13 6.5c0-1 1-1.4 1-2.5" />
    </svg>
  ),
  pack: (
    <svg {...iconProps} className="size-7">
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" />
      <path d="M4 8.5 12 13l8-4.5M12 13v7" />
    </svg>
  ),
  deliver: (
    <svg {...iconProps} className="size-7">
      <path d="M3 7h9v8H3z" />
      <path d="M12 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  ),
};

const keys = ["choose", "grill", "pack", "deliver"] as const;

/**
 * Block 5 — how an order is actually made. On desktop the section pins and the
 * four steps travel sideways as you scroll, so the sequence is read in the
 * order it happens rather than as a static grid.
 */
export default async function Process() {
  const t = await getTranslations("HomePage.process");

  return (
    <Section
      background="navy"
      containerClassName="pb-14 pt-20 md:pb-16 md:pt-24 xl:pb-20 xl:pt-28"
    >
      <div className="flex max-w-[620px] flex-col gap-3">
        <SectionTitle variant="white">{t("title")}</SectionTitle>
        <p className="text-16reg text-white/75">{t("text")}</p>
      </div>

      <div className="mt-10 md:mt-12">
        <ProcessTrack progressLabel={t("progressLabel")}>
          {keys.map((key, index) => (
            <article
              key={key}
              className="flex w-[264px] shrink-0 flex-col gap-4 rounded-tl-2xl rounded-br-2xl border border-white/12 bg-white/6 p-6 sm:w-[320px] lg:w-[460px] lg:p-8 xl:w-[520px]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-tl-xl rounded-br-xl bg-red text-white">
                  {icons[key]}
                </span>
                <span
                  aria-hidden
                  className="font-findsans text-40bold text-white/15 lg:text-48bold"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-findsans text-20bold uppercase text-white lg:text-24bold">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-14reg leading-relaxed text-white/70 lg:text-16reg">
                {t(`steps.${key}.text`)}
              </p>
            </article>
          ))}

          {/* Closes the sequence: the four steps end where ordering begins. */}
          <article className="flex w-[264px] shrink-0 flex-col justify-center gap-5 rounded-tl-2xl rounded-br-2xl bg-red p-6 sm:w-[320px] lg:w-[420px] lg:p-8">
            <h3 className="font-findsans text-20bold uppercase text-white lg:text-28bold">
              {t("cta.title")}
            </h3>
            <p className="text-14reg leading-relaxed text-white/85 lg:text-16reg">
              {t("cta.text")}
            </p>
            <Button
              href="/menu"
              variant="secondary"
              size="lg"
              className="w-fit border-white bg-white text-navy xl:enabled:hover:border-white xl:enabled:hover:bg-navy-dark xl:enabled:hover:text-white"
            >
              {t("cta.button")}
            </Button>
          </article>
        </ProcessTrack>
      </div>
    </Section>
  );
}
