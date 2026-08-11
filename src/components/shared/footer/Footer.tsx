"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Logo from "@/components/shared/logo/Logo";
import SectionWave from "@/components/shared/SectionWave";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import TelegramIcon from "@/components/shared/icons/TelegramIcon";
import TiktokIcon from "@/components/shared/icons/TiktokIcon";
import Image from "next/image";
import { navLinks } from "@/config/navigation";
import {
  getFooterVariant,
  getFooterWaveColor,
  type FooterVariant,
} from "@/config/footer";
import {
  ADDRESS,
  DEVELOPER_NAME,
  DEVELOPER_URL,
  EMAIL,
  INSTAGRAM_URL,
  PHONE,
  PHONE_HREF,
  TELEGRAM_URL,
  TIKTOK_URL,
} from "@/constants/contacts";
import { cn } from "@/utils/cn";

const socials = [
  { url: INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
  { url: TELEGRAM_URL, label: "Telegram", Icon: TelegramIcon },
  { url: TIKTOK_URL, label: "TikTok", Icon: TiktokIcon },
];

const variantStyles: Record<
  FooterVariant,
  {
    footer: string;
    social: string;
    nav: string;
    contacts: string;
    divider: string;
    developer: string;
  }
> = {
  light: {
    footer: "bg-white text-navy",
    social: "border-navy/15 text-navy",
    nav: "text-navy",
    contacts: "text-graphite",
    divider: "border-navy/10 text-grey-dark",
    developer: "text-navy",
  },
  dark: {
    footer: "bg-navy text-white",
    social: "border-white/20 text-white",
    nav: "text-white/90",
    contacts: "text-white/90",
    divider: "border-white/15 text-white/70",
    developer: "text-white",
  },
};

export default function Footer({ className }: { className?: string }) {
  const pathname = usePathname();
  const variant = getFooterVariant(pathname);
  const styles = variantStyles[variant];

  const t = useTranslations("Nav");
  const tf = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative z-10",
        pathname === "/" && "-mt-18",
        styles.footer,
        className,
      )}
    >
      <SectionWave from={getFooterWaveColor(pathname)} above />
      <Container className="relative pb-14 pt-12 md:pb-16 md:pt-14">
        <div className="absolute bottom-0 md:left-[calc(50%-240px/2)] lg:left-[calc(50%-339px/2)] xl:left-[calc(50%-509px/2)] md:w-[280px] md:h-[156px] lg:w-[359px] lg:h-[195px] xl:w-[509px] xl:h-[270px]">
          <Image
            src="/images/footer/decor.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-6">
            <Logo className="h-14 lg:h-18" />
            <ul className="flex items-center gap-4">
              {socials.map(({ url, label, Icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={label}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full border transition-colors duration-300 hover:border-red hover:text-red",
                      styles.social,
                    )}
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10 xs:flex-row xs:gap-20 md:contents">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-3 text-16med">
                {navLinks.map(({ href, key }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      className={cn("group relative inline-block", styles.nav)}
                    >
                      {t(key)}
                      <span
                        aria-hidden
                        className="absolute left-0 -bottom-1 h-0.5 w-8 origin-left scale-x-0 rounded-full bg-red transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul
              className={cn(
                "flex flex-col gap-3 text-16reg lg:mr-10 xl:mr-40",
                styles.contacts,
              )}
            >
              <li>
                {tf("phone")}:{" "}
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="transition-colors duration-300 hover:text-red"
                >
                  {PHONE}
                </a>
              </li>
              <li>
                {tf("email")}:{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors duration-300 hover:text-red"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="max-w-xs">
                {tf("address")}: {ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-12 flex flex-col gap-4 border-t pt-6 text-14reg",
            styles.divider,
          )}
        >
          <nav
            aria-label="Правова інформація"
            className="flex flex-col gap-x-6 gap-y-2"
          >
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-red"
            >
              {tf("privacy")}
            </Link>
            <Link
              href="/offer"
              className="transition-colors duration-300 hover:text-red"
            >
              {tf("offer")}
            </Link>
          </nav>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} Vtiha. {tf("rights")}.
            </p>
            <p>
              {tf("developedBy")} —{" "}
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={cn(
                  "transition-colors duration-300 hover:text-red",
                  styles.developer,
                )}
              >
                {DEVELOPER_NAME}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
