import type { ReactNode } from "react";
import PageTransition from "@/components/shared/motion/PageTransition";

/**
 * React remounts a template on every navigation (a layout persists), which is
 * exactly the hook a page-enter animation needs.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
