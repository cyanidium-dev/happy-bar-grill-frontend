import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Logo from "@/components/shared/logo/Logo";
import SectionWave from "@/components/shared/SectionWave";
import InstagramIcon from "@/components/shared/icons/InstagramIcon";
import TelegramIcon from "@/components/shared/icons/TelegramIcon";
import TiktokIcon from "@/components/shared/icons/TiktokIcon";
import { navLinks } from "@/config/navigation";
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

export default async function Footer({ className }: { className?: string }) {
  const t = await getTranslations("Nav");
  const tf = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className={cn("relative overflow-hidden bg-navy text-white", className)}>
      <SectionWave from="white" />
      <Container className="pb-14 pt-20 md:pb-16 md:pt-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Brand + socials */}
          <div className="flex flex-col gap-6">
            <Logo className="text-32semi md:text-40bold" light />
            <ul className="flex items-center gap-4">
              {socials.map(({ url, label, Icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-red hover:text-red"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-3 text-16med">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="group relative inline-block text-white/90"
                  >
                    {t(key)}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-red transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts */}
          <ul className="flex flex-col gap-3 text-16reg text-white/90">
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

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-14reg text-white/70">
          <nav
            aria-label="Правова інформація"
            className="flex flex-wrap gap-x-6 gap-y-2"
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

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} Happy Bar &amp; Grill Paradise. {tf("rights")}.
            </p>
            <p>
              {tf("developedBy")} —{" "}
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-white transition-colors duration-300 hover:text-red"
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
