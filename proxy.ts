import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Named `proxy.ts` (not `middleware.ts`) because this Next.js version
// renamed the Middleware convention to Proxy. next-intl's middleware
// factory is framework-agnostic, so we simply re-export it as `proxy`.
export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
