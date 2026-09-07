import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Images } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { collections } from "@/lib/collections";
import { getProducts, formatPrice } from "@/lib/products";
import { allProductsQueryOptions } from "@/lib/products-query";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { categoryStyleVars } from "@/lib/category-theme";
import { SITE_URL } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/breadcrumb-schema";
import { JsonLd } from "@/components/json-ld";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOrder = "default" | "price-asc" | "price-desc";

export const Route = createFileRoute("/shop/$collectionId/")({
  head: ({ params }) => {
    const collection = collections.find((c) => c.id === params.collectionId);
    const title = collection ? `${collection.name} | JY Creations` : "Collection | JY Creations";
    const description =
      collection?.description ?? "Browse our handmade collection at JY Creations.";
    const url = `${SITE_URL}/shop/${params.collectionId}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...(collection ? [{ property: "og:image", content: collection.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collectionId } = Route.useParams();
  const { data: allProducts } = useSuspenseQuery(allProductsQueryOptions());
  const collection = collections.find((c) => c.id === collectionId);
  const products = collection ? getProducts(allProducts, collection.id) : [];
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  const sortedProducts =
    sortOrder === "default"
      ? products
      : [...products].sort((a, b) =>
          sortOrder === "price-asc" ? a.price - b.price : b.price - a.price,
        );

  if (!collection) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Collection not found</h1>
        <Link
          to="/shop"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-20" style={categoryStyleVars(collection.id) as CSSProperties}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Shop", path: "/shop" },
          { name: collection.name, path: `/shop/${collection.id}` },
        ])}
      />
      {/* Atmospheric hero: category cover as background with an overlay for
          text legibility. Falls back gracefully if the image is slow to paint. */}
      <section
        className="relative overflow-hidden border-b border-border/40 bg-cover bg-center py-16 md:py-24"
        style={{ backgroundImage: `url(${collection.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 via-40% to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--cat)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to collections
          </Link>
          <Reveal>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[color:var(--cat)]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--cat)]">
                Collection
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
              {collection.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-foreground/80 md:text-lg">
              {collection.description}
            </p>
            {products.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {products.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <SelectTrigger className="w-[200px] rounded-full bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {products.length === 0 ? (
          <div className="rounded-2xl bg-card px-6 py-16 text-center">
            <p className="text-muted-foreground">
              More pieces from this collection are coming soon.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse other collections
            </Link>
          </div>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {sortedProducts.map((product, index) => (
              <StaggerItem
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border/40 transition-all hover:-translate-y-1 hover:elegant-shadow hover:ring-[color:var(--cat)]/50"
              >
                <Link
                  to="/shop/$collectionId/$productId"
                  params={{ collectionId: collection.id, productId: product.slug }}
                  className="relative block aspect-[3/4] overflow-hidden bg-secondary"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {product.images.length > 1 && (
                    <span
                      className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm"
                      aria-label={`${product.images.length} photos available`}
                    >
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      {product.images.length}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-[color:var(--cat)] px-4 py-2 text-xs font-semibold text-[color:var(--cat-fg)] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <Link
                      to="/shop/$collectionId/$productId"
                      params={{ collectionId: collection.id, productId: product.slug }}
                      className="font-display text-lg text-foreground transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <AddToCartButton product={product} className="mt-auto w-full" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </main>
  );
}
