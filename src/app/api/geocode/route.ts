import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/http/clientIp";
import { rateLimit } from "@/lib/http/rateLimit";
import { isSameOriginRequest } from "@/lib/http/sameOrigin";
import { API_TIMEOUT_MS } from "@/lib/http/timeout";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * Nominatim proxy for the delivery-address map.
 *
 * This exists rather than calling OpenStreetMap from the browser because
 * Nominatim's usage policy requires a request to identify the application, and
 * a browser cannot set `User-Agent`. Going through the server also lets us hold
 * to the "no more than one request per second" rule with our own rate limit
 * instead of trusting every client to behave, and keeps the customer's
 * coordinates from being sent to a third party with a full `Referer` chain.
 *
 * Two modes, both POST:
 *   `{ lat, lon }`  reverse geocode a dropped pin into a street address
 *   `{ q }`         search an address the customer typed
 *
 * POST rather than GET purely so the same-origin guard works: browsers only
 * send an `Origin` header on POST and cross-origin requests, so a GET version
 * of this route would have had to reject every real request or trust every
 * fake one. It also keeps this endpoint consistent with the other API routes.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org";

/**
 * Nominatim asks for a contact address in the agent string so they can get in
 * touch before blocking an app that misbehaves.
 */
const USER_AGENT = `VtihaOrdering/1.0 (${SITE_URL})`;

/** Comfortably inside Nominatim's 1 req/sec guidance, per client. */
const RATE = { limit: 20, windowMs: 60_000 };

/** Keeps the proxy pointed at the delivery city instead of the whole planet. */
const COUNTRY_CODES = "ua";

type NominatimPlace = {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: Record<string, string>;
};

/**
 * Builds a short, orderable address out of Nominatim's very long
 * `display_name` (which runs all the way up to "Україна" and a postcode).
 * A courier needs the street, the building and the city — nothing else.
 */
function formatAddress(place: NominatimPlace): string {
  const parts = place.address ?? {};
  const street =
    parts.road || parts.pedestrian || parts.footway || parts.residential || "";
  const house = parts.house_number || "";
  const city =
    parts.city || parts.town || parts.village || parts.municipality || "";

  const line = [street, house].filter(Boolean).join(", ");
  const full = [line, city].filter(Boolean).join(", ");

  // Fall back to the first two segments of display_name when the structured
  // address has no street (a dropped pin in the middle of a park, say).
  if (full) return full;
  return (place.display_name ?? "").split(",").slice(0, 2).join(",").trim();
}

function parseLocale(value: string | null): string {
  return value && (routing.locales as readonly string[]).includes(value)
    ? value
    : routing.defaultLocale;
}

async function callNominatim(path: string): Promise<unknown> {
  const response = await fetch(`${NOMINATIM}${path}`, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "uk,ru",
    },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    // OSM data changes slowly and the same pin is often re-queried while the
    // customer nudges the map; a day of caching is polite and free.
    next: { revalidate: 86_400 },
  });

  if (!response.ok) throw new Error(`nominatim ${response.status}`);
  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = rateLimit(`geocode:${getClientIp(request)}`, RATE);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const locale = parseLocale(
      typeof body.locale === "string" ? body.locale : null,
    );
    const query = typeof body.q === "string" ? body.q : null;

    if (query) {
      const trimmed = query.trim();
      if (trimmed.length < 3 || trimmed.length > 200) {
        return NextResponse.json({ results: [] });
      }

      const search = new URLSearchParams({
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        countrycodes: COUNTRY_CODES,
        "accept-language": locale,
        q: trimmed,
      });

      const raw = (await callNominatim(`/search?${search}`)) as NominatimPlace[];
      const results = (Array.isArray(raw) ? raw : []).flatMap((place) => {
        const lat = Number(place.lat);
        const lon = Number(place.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];
        return [{ address: formatAddress(place), lat, lng: lon }];
      });

      return NextResponse.json({ results });
    }

    const lat = Number(body.lat);
    const lon = Number(body.lon);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const reverse = new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      zoom: "18",
      "accept-language": locale,
      lat: String(lat),
      lon: String(lon),
    });

    const place = (await callNominatim(`/reverse?${reverse}`)) as NominatimPlace;
    return NextResponse.json({ address: formatAddress(place), lat, lng: lon });
  } catch (error) {
    console.error("[geocode] failed:", error);
    // The map is an assist, never a requirement — the address field still
    // accepts anything typed by hand, so a failure here is not fatal.
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
