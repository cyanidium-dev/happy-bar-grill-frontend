import { getLocale, getTranslations } from "next-intl/server";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import TelegramIcon from "@/components/shared/icons/TelegramIcon";
import TiktokIcon from "@/components/shared/icons/TiktokIcon";
import {
  EMAIL,
  INSTAGRAM_URL,
  PHONE,
  PHONE_HREF,
  TELEGRAM_URL,
  TIKTOK_URL,
  venueAddress,
  venueSchedule,
} from "@/constants/contacts";
import type { Locale } from "@/i18n/routing";
import type { ComponentType } from "react";

/**
 * Contact details, sourced from `@/constants/contacts` (placeholders until the
 * client provides real data — see the contacts page). Each row renders only
 * when its value is set, so the page never shows empty cards.
 */
export default async function ContactInfo() {
  const t = await getTranslations("ContactsPage");
  const locale = (await getLocale()) as Locale;

  const address = venueAddress(locale);
  const schedule = venueSchedule(locale);

  const rows: { label: string; value: string; href?: string }[] = [
    PHONE && { label: t("phone"), value: PHONE, href: `tel:${PHONE_HREF}` },
    EMAIL && { label: t("email"), value: EMAIL, href: `mailto:${EMAIL}` },
    schedule && { label: t("schedule"), value: schedule },
    address && { label: t("address"), value: address },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  const socials: {
    url: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
  }[] = [
    INSTAGRAM_URL && {
      url: INSTAGRAM_URL,
      label: "Instagram",
      Icon: InstagramIcon,
    },
    TELEGRAM_URL && {
      url: TELEGRAM_URL,
      label: "Telegram",
      Icon: TelegramIcon,
    },
    TIKTOK_URL && { url: TIKTOK_URL, label: "TikTok", Icon: TiktokIcon },
  ].filter(Boolean) as {
    url: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
  }[];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-20semi text-navy">{t("infoTitle")}</h2>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex flex-col gap-1 rounded-tl-xl rounded-br-xl bg-white p-4 shadow-card sm:rounded-tl-2xl sm:rounded-br-2xl"
          >
            <span className="text-12med uppercase tracking-wide text-grey-dark">
              {row.label}
            </span>
            {row.href ? (
              <a
                href={row.href}
                className="text-18semi text-navy transition-colors duration-300 hover:text-red"
              >
                {row.value}
              </a>
            ) : (
              <span className="text-18semi text-navy">{row.value}</span>
            )}
          </li>
        ))}
      </ul>

      {socials.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-12med uppercase tracking-wide text-grey-dark">
            {t("socials")}
          </span>
          <ul className="flex items-center gap-3">
            {socials.map(({ url, label, Icon }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full bg-navy text-white transition-colors duration-300 hover:bg-red"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
