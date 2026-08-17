import { NextResponse } from "next/server";
import { routing, type Locale } from "@/i18n/routing";
import { HREFLANG } from "@/lib/seo/constants";
import { localizedPathname } from "@/lib/seo/pageSeo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SITEMAP_BLOG_POSTS_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_DISHES_QUERY,
} from "@/sanity/lib/queries";
import { SPECIAL_OFFERS_SLUG } from "@/constants/menu";

type SitemapDoc = {
  slug: string;
  updatedAt?: string;
};

type SitemapDish = SitemapDoc & {
  categorySlug: string;
};

type SitemapUrl = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  alternates: Record<string, string>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

const STATIC_PAGES: { path: string; changefreq: string; priority: number }[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/menu", changefreq: "weekly", priority: 0.9 },
  { path: "/about", changefreq: "monthly", priority: 0.6 },
  { path: "/delivery", changefreq: "monthly", priority: 0.6 },
  { path: "/contacts", changefreq: "monthly", priority: 0.6 },
  { path: "/blog", changefreq: "weekly", priority: 0.7 },
];

async function fetchSanityDataServer<T>(query: string): Promise<T[]> {
  try {
    return await sanityFetch<T[]>({ query, tags: ["sitemap"] });
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return [];
  }
}

function formatDate(date: string | Date): string {
  return new Date(date).toISOString();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absolute(baseUrl: string, pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalized === "/") return `${baseUrl}/`;
  return `${baseUrl}${normalized}`;
}

function languageMap(baseUrl: string, path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[HREFLANG[locale]] = absolute(
      baseUrl,
      localizedPathname(locale, path),
    );
  }
  languages["x-default"] = absolute(
    baseUrl,
    localizedPathname(routing.defaultLocale, path),
  );
  return languages;
}

function entriesForPath(
  baseUrl: string,
  path: string,
  options: {
    lastModified?: string | Date;
    changefreq?: string;
    priority?: number;
  } = {},
): SitemapUrl[] {
  const alternates = languageMap(baseUrl, path);
  const lastmod = formatDate(options.lastModified ?? new Date());
  const changefreq = options.changefreq ?? "weekly";
  const priority = options.priority ?? 0.7;

  return routing.locales.map((locale: Locale) => ({
    loc: absolute(baseUrl, localizedPathname(locale, path)),
    lastmod,
    changefreq,
    priority,
    alternates,
  }));
}

async function getDynamicPages(baseUrl: string): Promise<SitemapUrl[]> {
  const now = new Date().toISOString();

  const [categories, dishes, blogPosts] = await Promise.all([
    fetchSanityDataServer<SitemapDoc>(SITEMAP_CATEGORIES_QUERY),
    fetchSanityDataServer<SitemapDish>(SITEMAP_DISHES_QUERY),
    fetchSanityDataServer<SitemapDoc>(SITEMAP_BLOG_POSTS_QUERY),
  ]);

  return [
    ...entriesForPath(baseUrl, `/menu/${SPECIAL_OFFERS_SLUG}`, {
      lastModified: now,
      changefreq: "weekly",
      priority: 0.8,
    }),
    ...categories.flatMap((category) =>
      entriesForPath(baseUrl, `/menu/${category.slug}`, {
        lastModified: category.updatedAt ?? now,
        changefreq: "monthly",
        priority: 0.8,
      }),
    ),
    ...dishes.flatMap((dish) =>
      entriesForPath(baseUrl, `/menu/${dish.categorySlug}/${dish.slug}`, {
        lastModified: dish.updatedAt ?? now,
        changefreq: "monthly",
        priority: 0.7,
      }),
    ),
    ...blogPosts.flatMap((post) =>
      entriesForPath(baseUrl, `/blog/${post.slug}`, {
        lastModified: post.updatedAt ?? now,
        changefreq: "monthly",
        priority: 0.6,
      }),
    ),
  ];
}

function generateSitemapXml(baseUrl: string, urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map((url) => {
      const hreflangLinks = Object.entries(url.alternates)
        .map(
          ([hreflang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${formatDate(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${hreflangLinks}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

export async function GET() {
  try {
    const baseUrl =
      SITE_URL.replace(/\/+$/, "") || "https://happy-bar-grill.vercel.app";
    const now = new Date().toISOString();

    const staticPages = STATIC_PAGES.flatMap(({ path, changefreq, priority }) =>
      entriesForPath(baseUrl, path, {
        lastModified: now,
        changefreq,
        priority,
      }),
    );

    const dynamicPages = await getDynamicPages(baseUrl);
    const allUrls = [...staticPages, ...dynamicPages];
    const xml = generateSitemapXml(baseUrl, allUrls);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
