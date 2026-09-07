import { createFileRoute, Link } from "@tanstack/react-router";
import { collections } from "@/lib/collections";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getCategoryTheme } from "@/lib/category-theme";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop Collections | JY Creations" },
      {
        name: "description",
        content:
          "Browse all handmade collections at JY Creations: dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers.",
      },
      { property: "og:title", content: "Shop Collections | JY Creations" },
      { property: "og:description", content: "Browse all handmade collections at JY Creations." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/shop` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop` }],
  }),
  component: ShopIndexPage,
});

function ShopIndexPage() {
  return (
    <main className="pb-20">
      <section className="bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Reveal>
            <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
              Shop Collections
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Each collection is thoughtfully handmade with care, detail, and a touch of romance.
              Explore all nine below.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Stagger className="grid gap-6 sm:grid-cols-2 md:gap-8 md:grid-cols-3">
          {collections.map((collection, index) => {
            const theme = getCategoryTheme(collection.id);
            return (
              <StaggerItem key={collection.id}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/shop/$collectionId"
                    params={{ collectionId: collection.id }}
                    className="group block overflow-hidden rounded-2xl bg-card ring-1 ring-border/40 transition-all hover:-translate-y-1 hover:elegant-shadow"
                  >
                    <div className="h-1.5 w-full" style={{ backgroundColor: theme.accent }} />
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        width={800}
                        height={800}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span
                        className="absolute bottom-4 left-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{ backgroundColor: theme.accent, color: theme.accentForeground }}
                      >
                        Explore
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg text-foreground">{collection.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
    </main>
  );
}
