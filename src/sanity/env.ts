export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
}

if (!process.env.SANITY_API_READ_TOKEN) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing SANITY_API_READ_TOKEN");
  }
  console.warn(
    "[sanity] SANITY_API_READ_TOKEN is not set — menu documents will come back empty.",
  );
}
