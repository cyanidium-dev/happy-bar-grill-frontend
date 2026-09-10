import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { findSansPro } from "@/fonts/findSans";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import ScrollProgress from "@/components/shared/scroll/ScrollProgress";
import ScrollRefresh from "@/components/shared/scroll/ScrollRefresh";
import BackToTop from "@/components/shared/scroll/BackToTop";
import BottomNav from "@/components/shared/bottomNav/BottomNav";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import ServiceWorkerRegistrar from "@/components/pwa/ServiceWorkerRegistrar";
import {
  defaultSocialImageUrl,
  OG_LOCALE,
  SITE_ALLOW_INDEXING,
  SITE_URL,
} from "@/lib/seo/constants";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * `viewportFit: "cover"` lets the page paint under the iPhone's rounded
 * corners and home indicator, which is what makes the installed app look
 * native rather than letter-boxed. Everything pinned to the bottom edge pays
 * for it with an explicit `env(safe-area-inset-bottom)`.
 *
 * `themeColor` tints the status bar and the Android task-switcher card to
 * match the header, and is intentionally the same value as the manifest's.
 */
export const viewport: Viewport = {
  themeColor: "#002755",
  colorScheme: "light",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Pre-render the locale shell for every configured locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: t("site.name"),
      // The status bar sits over the page, so the header's navy shows through.
      statusBarStyle: "black-translucent",
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
    title: {
      default: t("site.title"),
      // Page titles render as "<page> | Vtiha".
      template: `%s | ${t("site.name")}`,
    },
    description: t("site.description"),
    // Temporary site-wide block until the permanent domain is live.
    ...(!SITE_ALLOW_INDEXING
      ? { robots: { index: false, follow: false } }
      : {}),
    openGraph: {
      type: "website",
      siteName: t("site.name"),
      locale: OG_LOCALE[locale as Locale],
      images: [
        {
          url: defaultSocialImageUrl(),
          width: 1200,
          height: 630,
          alt: t("site.name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [defaultSocialImageUrl()],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this request's locale.
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${findSansPro.variable} h-full antialiased scrollbar-brand`}
    >
      {/* The bottom navigation is `fixed`, so the page reserves its height
          here. The variable is 0 above `lg`, where the bar is hidden. */}
      <body
        className="flex min-h-full flex-col"
        style={{
          paddingBottom:
            "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
        }}
      >
        <NextIntlClientProvider>
          <ScrollProgress />
          <ScrollRefresh />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-white focus:px-4 focus:py-3 focus:text-14med focus:text-navy focus:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky"
          >
            {t("skipToContent")}
          </a>
          <Header />
          {/* `overflow-x-clip` here (not on `body`) prevents a horizontal
              scrollbar from off-screen slide-in animations. The header is
              `fixed` (floats over the page), so this wrapper reserves its
              height as top padding — `Hero` cancels it back out to sit
              behind the header instead. */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col overflow-x-clip outline-none"
            style={{ paddingTop: "var(--header-height)" }}
          >
            {children}
          </main>
          <Footer />
          <BackToTop label={t("backToTop")} />
          <BottomNav />
          <InstallPrompt />
          <ServiceWorkerRegistrar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
