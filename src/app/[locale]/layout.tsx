import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
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

// Display / headings / prices. Bound to --font-display.
// Not on Google Fonts — self-hosted from src/fonts (SIL OFL, see LICENSE.txt there).
const findSansPro = localFont({
  src: [
    {
      path: "../../fonts/FindSansPro/FindSansPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/FindSansPro/FindSansPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/FindSansPro/FindSansPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/FindSansPro/FindSansPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-findsans",
  display: "swap",
});

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
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
