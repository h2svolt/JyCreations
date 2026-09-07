import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import appCss from "../styles.css?url";
import logo from "../assets/jy-creations-logo.webp";
import { CartProvider } from "../lib/cart";
import { CartSheet } from "../components/cart-sheet";
import { Toaster } from "../components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { easeOut } from "../components/motion";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { allProductsQueryOptions } from "../lib/products-query";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JY Creations | Handmade with Love" },
      {
        name: "description",
        content:
          "Discover handmade dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers at JY Creations.",
      },
      { name: "author", content: "JY Creations" },
      { property: "og:title", content: "JY Creations | Handmade with Love" },
      {
        property: "og:description",
        content:
          "Discover handmade dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers at JY Creations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@JYCreations" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(allProductsQueryOptions()),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const SITE_URL = "https://www.jycreations.store";

// Tells Google (and anything else reading structured data) who this business
// is — name, logo, social profiles — so results like the "About this
// result" panel have something to show instead of "No information is
// available for this page."
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JY Creations",
  url: SITE_URL,
  logo: `${SITE_URL}${logo}`,
  description:
    "Handmade dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers.",
  email: "jycreations2@gmail.com",
  sameAs: [
    "https://www.instagram.com/jycreations1?igsi=MTB4NmI0aGt3YXI1ag==",
    "https://www.facebook.com/share/19YSx35aDS/?mibextid=wwXIfr",
    "https://youtube.com/@jycreations976?si=fo1n5z6KrDvt0pAl",
    "https://www.tiktok.com/@jycreations1?_r=1&_t=ZS-99XPr0rWQlw",
  ],
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            {/* Crossfades between routes instead of the hard instant swap
                Outlet does on its own — keyed by pathname so each navigation
                gets its own enter/exit. Header/footer live outside this, so
                they stay put while only the page content transitions. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="flex-1"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
            <SiteFooter />
          </div>
          <CartSheet />
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
