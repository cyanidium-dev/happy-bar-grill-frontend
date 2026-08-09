import { getTranslations } from "next-intl/server";
import { MAP_QUERY } from "@/constants/contacts";

/**
 * Google Maps embed. Centered on the city (Миколаїв) for now — swap `MAP_QUERY`
 * for the exact address once the client provides it.
 */
export default async function ContactsMap() {
  const t = await getTranslations("ContactsPage");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    MAP_QUERY,
  )}&output=embed`;

  return (
    <iframe
      title={t("mapTitle")}
      src={mapSrc}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="aspect-[4/3] w-full rounded-tl-2xl rounded-br-2xl border-0 shadow-card md:aspect-[16/7]"
    />
  );
}
