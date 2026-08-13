import { fetchSchemaJsonLd } from "@/lib/seo/schemaJson";
import { JsonLd } from "@/components/seo/JsonLd";
import type { PageSeo } from "@/types/seo";

export async function SchemaJsonFromSeo({ seo }: { seo?: PageSeo | null }) {
  const data = await fetchSchemaJsonLd(seo?.schemaJsonUrl);
  if (!data) return null;
  return <JsonLd data={data} />;
}
