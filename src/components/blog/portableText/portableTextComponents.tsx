import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Link } from "@/i18n/navigation";
import Button from "@/components/shared/buttons/Button";
import { urlForImage } from "@/sanity/lib/image";
import { cn } from "@/utils/cn";

/** Content column is capped at ~768px, so images never need the full viewport. */
const BLOG_CONTENT_IMAGE_SIZES = "(max-width: 1024px) 100vw, 768px";

type ImageValue = { asset?: { _ref?: string }; alt?: string };
type GalleryValue = {
  items?: { _key?: string; image?: ImageValue }[];
};
type TableValue = { rows?: { _key?: string; cells?: string[] }[] };

/** Parse `image-<hash>-<W>x<H>-<ext>` → intrinsic size (avoids layout shift). */
function refDimensions(ref?: string): { width: number; height: number } {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return { width: 1200, height: 800 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href) || href.startsWith("mailto:");
}

/**
 * Portable Text serializers for blog article content and FAQ answers, styled in
 * the project's design system. Handles headings (h2–h4), lists, marks/links,
 * constrained inline images, image galleries, tables and the custom
 * `faqAnswerButton` CTA block. Mirrors the block set of the Sanity
 * `articlePortableText` schema.
 */
export const blogPortableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-findsans text-24bold uppercase text-navy first:mt-0 lg:text-28bold">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-18semi text-navy lg:text-20semi">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-16semi uppercase tracking-wide text-navy lg:text-18semi">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-16reg leading-relaxed text-graphite">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 flex list-disc flex-col gap-2 pl-5 marker:text-red">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 flex list-decimal flex-col gap-2 pl-5 marker:text-red">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-16reg leading-relaxed text-graphite">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-16reg leading-relaxed text-graphite">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-navy">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const cls =
        "text-red underline underline-offset-2 transition-colors duration-300 hover:text-red-dark";
      if (isExternal(href)) {
        return (
          <a
            href={href}
            target={value?.blank ? "_blank" : undefined}
            rel={value?.blank ? "noopener noreferrer" : undefined}
            className={cls}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }: { value: ImageValue }) => {
      const ref = value?.asset?._ref;
      if (!ref) return null;
      const { width, height } = refDimensions(ref);
      const src = urlForImage(value as SanityImageSource)
        .width(1600)
        .fit("max")
        .auto("format")
        .url();
      const isPortrait = height > width;
      return (
        // Landscape photos fill the column; tall/narrow (portrait) ones are
        // capped by height with the width following, so the figure hugs the
        // photo and no letterbox background shows on the sides.
        <figure className="my-8 flex justify-center">
          <Image
            src={src}
            alt={value?.alt ?? ""}
            width={width}
            height={height}
            sizes={BLOG_CONTENT_IMAGE_SIZES}
            className={cn(
              "rounded-tl-2xl rounded-br-2xl shadow-card",
              isPortrait
                ? "h-auto max-h-[75dvh] w-auto max-w-full"
                : "h-auto w-full",
            )}
          />
        </figure>
      );
    },
    gallerySection: ({ value }: { value: GalleryValue }) => {
      const items = (value?.items ?? []).filter((it) => it?.image?.asset?._ref);
      if (items.length === 0) return null;
      return (
        <div className="my-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const src = urlForImage(item.image as SanityImageSource)
              .width(900)
              .fit("max")
              .auto("format")
              .url();
            return (
              <figure
                key={item._key ?? index}
                className="relative aspect-[4/3] overflow-hidden rounded-tl-xl rounded-br-xl border border-navy/12"
              >
                <Image
                  src={src}
                  alt={item.image?.alt ?? ""}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </figure>
            );
          })}
        </div>
      );
    },
    table: ({ value }: { value: TableValue }) => {
      const rows = value?.rows ?? [];
      if (rows.length === 0) return null;
      const [header, ...body] = rows;
      return (
        <div className="my-8 w-full overflow-x-auto rounded-tl-xl rounded-br-xl border border-navy/12">
          <table className="w-full border-collapse text-14reg">
            <thead>
              <tr className="bg-navy text-white">
                {(header?.cells ?? []).map((cell, i) => (
                  <th key={i} className="p-3 text-left text-14semi">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={row?._key ?? r} className="odd:bg-beige/40">
                  {(row?.cells ?? []).map((cell, c) => (
                    <td
                      key={c}
                      className="border-t border-navy/10 p-3 text-graphite"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    faqAnswerButton: ({ value }) => {
      const href: string = value?.href ?? "/";
      return (
        <div className="my-6">
          <Button
            href={href}
            variant="primary"
            shape="leaf"
            size="md"
            className="!text-white"
          >
            {value?.label ?? ""}
          </Button>
        </div>
      );
    },
  },
};
