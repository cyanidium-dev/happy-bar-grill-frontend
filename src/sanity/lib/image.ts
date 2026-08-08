import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

// Read the public project details directly (not via `@/sanity/env`, which also
// validates the server-only read token). This module is bundled into the client
// through the Portable Text serializers, where that token is intentionally
// absent — importing the server guard here would crash the browser bundle.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a CDN URL for a Sanity image reference. Used for images embedded inside
 * Portable Text (`content`), where the raw asset reference travels with the
 * block. Hero/thumbnail images are resolved to `asset->url` directly in GROQ.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
