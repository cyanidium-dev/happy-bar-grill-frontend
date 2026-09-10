/* eslint-disable no-restricted-globals */

/**
 * Vtiha service worker — offline shell + asset caching.
 *
 * Deliberately narrow: it only handles same-origin GET traffic it understands
 * (documents, hashed build assets, images) and lets everything else fall
 * straight through to the network. Anything it cannot classify is untouched,
 * so a bug here degrades to "no caching", never to "broken site".
 *
 * BUMP `VERSION` ON EVERY DEPLOY THAT CHANGES CACHING BEHAVIOUR. Activating a
 * new version deletes every cache whose name carries an older version, which
 * is the only way stale HTML from a previous build is guaranteed to go away.
 */

const VERSION = "v1";

const CACHE = {
  shell: `vtiha-shell-${VERSION}`,
  pages: `vtiha-pages-${VERSION}`,
  assets: `vtiha-assets-${VERSION}`,
  images: `vtiha-images-${VERSION}`,
};

const CACHE_NAMES = Object.values(CACHE);

/** Locale-prefixed offline routes (`as-needed` prefixing: `uk` has no prefix). */
const OFFLINE_URLS = ["/offline", "/ru/offline"];

const PRECACHE = [
  ...OFFLINE_URLS,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

/** Hard ceilings so a long browsing session can't fill the origin's quota. */
const LIMITS = { pages: 60, images: 120 };

/** How long to wait for the network on a navigation before serving cache. */
const NAVIGATION_TIMEOUT_MS = 4000;

/* -------------------------------------------------------------------------
   Install / activate
   ---------------------------------------------------------------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE.shell);
      // `addAll` rejects the whole batch if a single entry 404s, which would
      // leave the worker permanently uninstallable. Cache entries one by one
      // and tolerate individual failures.
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: "reload" }));
          } catch {
            // A missing precache entry only costs us the offline fallback.
          }
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("vtiha-") && !CACHE_NAMES.includes(key))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/**
 * The page asks for the update only when the user accepts it, so a reload
 * never swaps the running build out from under an in-progress checkout.
 */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/* -------------------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------------- */

/**
 * Trim a cache down to `max` entries, oldest first. `caches` keys are returned
 * in insertion order, so slicing from the front drops the least recently
 * *added* entries — good enough without tracking access times.
 */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
}

/** Only store responses we can actually replay later. */
function isCacheable(response) {
  if (!response || !response.ok) return false;
  // `opaque` (no-cors cross-origin) responses have unknown status and can
  // silently poison a cache with error pages.
  if (response.type === "opaque") return false;
  const control = response.headers.get("Cache-Control") || "";
  return !control.includes("no-store");
}

/**
 * Stores a copy of `response`.
 *
 * The clone is taken by the CALLER, synchronously, before the response is
 * handed back to the page. Cloning later — after any `await` — throws
 * "Response body is already used", because the page has started reading the
 * stream in the meantime. That failure is silent (an unhandled rejection in a
 * detached promise), so it presents as "caching mysteriously does nothing".
 */
async function putInCache(cacheName, request, copy, max) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, copy);
    if (max) await trim(cacheName, max);
  } catch {
    // Quota exceeded or an unstorable response — caching is best-effort.
  }
}

/**
 * Clone now, write later, and keep the worker alive until the write lands.
 * Without `waitUntil` the browser is free to kill the worker as soon as the
 * response is returned, which drops the pending cache write.
 */
function cacheInBackground(event, cacheName, request, response, max) {
  if (!isCacheable(response)) return;
  const copy = response.clone();
  event.waitUntil(putInCache(cacheName, request, copy, max));
}

/** The offline document for whichever locale the user was browsing. */
async function offlineFallback(request) {
  const isRu = new URL(request.url).pathname.startsWith("/ru");
  const cache = await caches.open(CACHE.shell);
  return (
    (await cache.match(isRu ? "/ru/offline" : "/offline")) ||
    (await cache.match("/offline")) ||
    Response.error()
  );
}

/* -------------------------------------------------------------------------
   Strategies
   ---------------------------------------------------------------------- */

/**
 * Documents and RSC payloads: network first, so a live page always wins and
 * the user never sees yesterday's menu while online. The cached copy is the
 * safety net, and the offline page is the last resort.
 *
 * The timeout matters on flaky mobile data, where a request can hang for
 * ~30s before the browser gives up — long enough that the app looks frozen.
 */
async function networkFirst(event, request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NAVIGATION_TIMEOUT_MS);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    cacheInBackground(event, CACHE.pages, request, response, LIMITS.pages);
    return response;
  } catch {
    clearTimeout(timer);
    const cached = await caches.match(request);
    if (cached) return cached;
    // An RSC fetch has no useful offline representation — failing it lets the
    // Next.js router fall back to a full navigation, which hits the shell.
    if (request.mode !== "navigate") throw new Error("offline");
    return offlineFallback(request);
  }
}

/**
 * Content-hashed build output (`/_next/static/...`) is immutable: a changed
 * file always arrives under a new URL, so a cache hit is never stale and a
 * revalidation would be wasted bandwidth.
 */
async function cacheFirst(event, request, cacheName, max) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cacheInBackground(event, cacheName, request, response, max);
  return response;
}

/* -------------------------------------------------------------------------
   Routing
   ---------------------------------------------------------------------- */

const IMAGE_HOSTS = new Set(["cdn.sanity.io", "images.unsplash.com"]);

function isImageRequest(url, request) {
  if (request.destination === "image") return true;
  if (url.pathname.startsWith("/_next/image")) return true;
  return /\.(?:avif|webp|png|jpe?g|gif|svg|ico)$/i.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never touch mutations, range requests (media seeking), or anything the
  // browser is not asking us to fetch normally.
  if (request.method !== "GET") return;
  if (request.headers.has("Range")) return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const sameOrigin = url.origin === self.location.origin;

  // Remote images (Sanity CDN) are the one cross-origin case worth keeping —
  // they are the bulk of the payload and they never change under a given URL.
  if (!sameOrigin) {
    if (IMAGE_HOSTS.has(url.hostname)) {
      event.respondWith(
        cacheFirst(event, request, CACHE.images, LIMITS.images).catch(() =>
          caches.match(request).then((hit) => hit || Response.error()),
        ),
      );
    }
    return;
  }

  // Order routes, the Telegram webhook and the sitemap must always be live.
  if (url.pathname.startsWith("/api/")) return;
  // Dev-only endpoints (HMR, turbopack) must never be intercepted.
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, request, CACHE.assets));
    return;
  }

  if (isImageRequest(url, request)) {
    event.respondWith(
      cacheFirst(event, request, CACHE.images, LIMITS.images).catch(() =>
        caches.match(request).then((hit) => hit || Response.error()),
      ),
    );
    return;
  }

  const isDocument =
    request.mode === "navigate" ||
    request.destination === "document" ||
    // React Server Component payloads for client-side navigations.
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1";

  if (isDocument) {
    event.respondWith(networkFirst(event, request));
  }
});
