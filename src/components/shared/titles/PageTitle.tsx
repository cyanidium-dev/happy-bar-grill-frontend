import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** The single <h1> of a page. Display font, uppercase (bravo house style). */
export default function PageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-findsans text-32bold lg:text-48bold uppercase text-white",
        className,
      )}
    >
      {children}
    </h1>
  );
}
