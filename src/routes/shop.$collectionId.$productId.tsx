import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { collections } from "@/lib/collections";
import { getProduct, getProducts, formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { easeOut, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { categoryStyleVars } from "@/lib/category-theme";
import type { CSSProperties } from "react";

export const Route = createFileRoute("/shop/$collectionId/$productId")({
  head: ({ params }) => {
    const collection = collections.find((c) => c.id === params.collectionId);
    const product = collection
      ? getProduct(collection.id, collection.shortName, params.productId)
      : undefined;

    return {
      meta: [
        { title: product ? `${product.name} | JY Creations` : "Product | JY Creations" },
        {
          name: "description",
          content: product
            ? `${product.name} — handmade ${collection?.name.toLowerCase() ?? "piece"} from JY Creations.`
            : "Handmade pieces from JY Creations.",
        },
        { property: "og:type", content: "product" },
        ...(product ? [{ property: "og:image", content: product.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const collection = collections.find((c) => c.id === params.collectionId);
    if (!collection) throw notFound();

    const product = getProduct(collection.id, collection.shortName, params.productId);
    if (!product) throw notFound();

    return { collectionId: collection.id, productId: product.slug };
  },
  component: ProductPage,
});

function ProductPage() {
  const { collectionId, productId } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const collection = collections.find((c) => c.id === collectionId)!;
  const product = getProduct(collection.id, collection.shortName, productId)!;

  const related = getProducts(collection.id, collection.shortName)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <main className="pb-20" style={categoryStyleVars(collection.id) as CSSProperties}>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/shop"
            className="text-muted-foreground transition-colors hover:text-[color:var(--cat)]"
          >
            Shop
          </Link>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <Link
            to="/shop/$collectionId"
            params={{ collectionId: collection.id }}
            className="text-muted-foreground transition-colors hover:text-[color:var(--cat)]"
          >
            {collection.shortName}
          </Link>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage] ?? product.image}
                  alt={
                    product.images.length > 1
                      ? `${product.name} — view ${activeImage + 1} of ${product.images.length}`
                      : product.name
                  }
                  width={1200}
                  height={1200}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            {product.images.length > 1 && product.imageLabels ? (
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label={`${product.name} options`}
              >
                {product.images.map((src, index) => {
                  const label = product.imageLabels?.[index];
                  // An empty label marks a lead "cover" shot that isn't
                  // itself a selectable option — skip it from the swatch row.
                  if (!label) return null;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      role="radio"
                      aria-checked={index === activeImage}
                      aria-label={label ?? `Option ${index + 1}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <span
                        className={cn(
                          "relative h-16 w-16 overflow-hidden rounded-full border-2 bg-secondary transition-colors",
                          index === activeImage
                            ? "border-[color:var(--cat)]"
                            : "border-transparent opacity-70 hover:opacity-100",
                        )}
                      >
                        <img
                          src={src}
                          alt=""
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          index === activeImage
                            ? "text-[color:var(--cat)]"
                            : "text-muted-foreground",
                        )}
                      >
                        {label ?? `Option ${index + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              product.images.length > 1 && (
                <div
                  className="grid grid-cols-4 gap-3 sm:grid-cols-5"
                  role="group"
                  aria-label={`${product.name} images`}
                >
                  {product.images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show image ${index + 1} of ${product.images.length}`}
                      aria-current={index === activeImage}
                      className={cn(
                        "relative overflow-hidden rounded-xl border-2 bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        index === activeImage
                          ? "border-transparent"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        width={200}
                        height={200}
                        className="aspect-[3/4] h-full w-full object-cover"
                        loading="lazy"
                      />
                      {index === activeImage && (
                        <motion.span
                          layoutId="active-thumb-ring"
                          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[color:var(--cat)]"
                          transition={{ duration: 0.3, ease: easeOut }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )
            )}
          </div>

          <Reveal className="flex flex-col gap-6 lg:pt-4">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-[color:var(--cat)]">
                {collection.shortName}
              </span>
              <h1 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 font-display text-2xl text-foreground">
                {formatPrice(product.price)}
              </p>
              {product.imageLabels?.[activeImage] && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Color:{" "}
                  <span className="font-medium text-foreground">
                    {product.imageLabels[activeImage]}
                  </span>
                </p>
              )}
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">
              {collection.description} Each piece is handmade to order, so slight variations in
              colour and finish are part of its character.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className="relative grid w-10 place-items-center overflow-hidden"
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={quantity}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.15, ease: easeOut }}
                      className="text-center font-medium tabular-nums"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <AddToCartButton
                product={product}
                quantity={quantity}
                openCartOnAdd
                className="soft-glow h-11 flex-1 sm:flex-none sm:px-8"
              />
            </div>

            <dl className="grid gap-3 rounded-2xl bg-card p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Collection</dt>
                <dd className="text-foreground">{collection.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Made</dt>
                <dd className="text-foreground">Handcrafted to order</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Availability</dt>
                <dd className="text-foreground">In stock</dd>
              </div>
            </dl>

            <Link
              to="/shop/$collectionId"
              params={{ collectionId: collection.id }}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--cat)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {collection.shortName}
            </Link>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <Reveal>
            <h2 className="font-display text-2xl text-foreground">You may also like</h2>
          </Reveal>
          <Stagger key={product.slug} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/shop/$collectionId/$productId"
                  params={{ collectionId: collection.id, productId: item.slug }}
                  className="group block overflow-hidden rounded-2xl bg-card transition-all hover:-translate-y-1 hover:elegant-shadow"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-secondary">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </main>
  );
}
