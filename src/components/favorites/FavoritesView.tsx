"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import Button from "@/components/shared/buttons/Button";
import QuickAddButton from "@/components/shared/cards/QuickAddButton";
import HeartIcon from "@/components/shared/icons/HeartIcon";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import ImagePlaceholder from "@/components/shared/media/ImagePlaceholder";
import {
  useFavoritesHydrated,
  useFavoritesStore,
} from "@/store/favoritesStore";
import { dishHref } from "@/utils/dishHref";

/**
 * Saved dishes, rendered entirely from localStorage.
 *
 * No Sanity round-trip on purpose: this screen is one of the two (with the
 * order history) that must work with no network at all, which is the whole
 * point of the offline cache. The stored price is a snapshot, so every row
 * links through to the live dish page and the cart is re-priced on the server
 * at checkout — nothing here is ever the final word on money.
 */
export default function FavoritesView() {
  const t = useTranslations("Favorites");
  const tp = useTranslations("Product");
  const hydrated = useFavoritesHydrated();
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);

  // The server render has an empty store; hold the layout until localStorage
  // lands rather than flashing the empty state at every returning visitor.
  if (!hydrated) {
    return <Container className="min-h-[40vh] pb-16 pt-10 md:pb-20 md:pt-14" />;
  }

  if (items.length === 0) {
    return (
      <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white px-6 py-14 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-red/10 text-red">
            <HeartIcon className="size-8" />
          </span>
          <h1 className="font-findsans text-24bold uppercase text-navy">
            {t("emptyTitle")}
          </h1>
          <p className="text-16reg text-grey-dark">{t("emptyText")}</p>
          <Button href="/menu" variant="primary" shape="leaf">
            {t("toMenu")}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 md:mb-10">
        <h1 className="font-findsans text-28bold uppercase text-navy lg:text-40bold">
          {t("title")}
        </h1>
        <p className="text-14reg text-grey-dark">
          {t("count", { count: items.length })}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const href = dishHref(item);
          return (
            <li
              key={item.id}
              data-fly-origin
              className="group relative flex gap-3 rounded-tl-xl rounded-br-xl border border-navy/12 bg-white p-3 shadow-card transition-[box-shadow] duration-300 sm:rounded-tl-2xl sm:rounded-br-2xl xl:hover:shadow-card-hover"
            >
              <Link
                href={href}
                aria-label={item.name}
                className="relative aspect-[4/3] w-28 shrink-0 self-start overflow-hidden rounded-tl-lg rounded-br-lg sm:w-32"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.imageAlt ?? item.name}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    background="beige"
                    className="absolute inset-0 size-full"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={href}
                  className="font-findsans line-clamp-2 text-16bold text-navy transition-colors duration-300 xl:group-hover:text-red"
                >
                  {item.name}
                </Link>
                {item.weight ? (
                  <span className="mt-1 text-12med text-grey-dark">
                    {item.weight} {tp("weightUnit")}
                  </span>
                ) : null}

                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                  <span className="font-findsans text-14bold text-navy">
                    {item.price} {tp("currency")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={t("remove")}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-grey-dark transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 sm:size-11"
                    >
                      <TrashIcon className="size-4.5" />
                    </button>
                    <QuickAddButton line={item} label={tp("addToCart")} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
