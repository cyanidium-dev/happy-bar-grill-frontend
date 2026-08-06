import { cn } from "@/utils/cn";

/**
 * Temporary body for routes whose sections have not been built yet.
 * Server component — keeps every page SSR and gives it a visible <h1> so the
 * routing structure can be reviewed before real sections land. Remove the usage
 * from a page once its real sections replace it.
 */
export default function PagePlaceholder({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 py-24 text-center",
        className,
      )}
    >
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-zinc-500">
        Sections for this page will be added later.
      </p>
    </main>
  );
}
