import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/shared/container/Container";
import { cn } from "@/utils/cn";

export type BreadCrumbItem = {
  label: string;
  /** Omit on the current page — it renders as plain text instead of a link. */
  href?: string;
};

/**
 * Breadcrumb trail shown under the header on every page except home.
 * A "Home" link (translated, locale-aware) is prepended automatically, so
 * pages only need to pass the segments below it — e.g. `[{ label: t("blog.title") }]`
 * or `[{ label: menuLabel, href: "/menu" }, { label: categoryLabel }]`.
 */
export default async function BreadCrumbs({
  items,
  className,
}: {
  items: BreadCrumbItem[];
  className?: string;
}) {
  const t = await getTranslations("Nav");
  const trail: BreadCrumbItem[] = [{ label: t("home"), href: "/" }, ...items];

  return (
    <Container
      as="nav"
      aria-label="Breadcrumb"
      className={cn("pt-4 md:pt-6", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-14med text-grey-dark">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          const isLink = !isLast && Boolean(item.href);

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-x-2"
            >
              {index > 0 && (
                <span aria-hidden className="text-grey">
                  /
                </span>
              )}
              {isLink ? (
                <Link
                  href={item.href!}
                  className="transition-colors hover:text-navy"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-navy" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
