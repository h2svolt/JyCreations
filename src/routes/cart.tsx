import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { easeOut } from "@/components/motion";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | JY Creations" },
      { name: "description", content: "Review the handmade pieces in your JY Creations cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, hydrated, increment, decrement, removeItem, clear, totalQuantity, totalValue } =
    useCart();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl text-foreground md:text-4xl">Your Cart</h1>

      {/* Until hydration completes we can't know the real cart, so show a
            neutral placeholder rather than flashing "empty" then filling in. */}
      {!hydrated ? (
        <div className="mt-10 space-y-4" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-card px-6 py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-display text-xl text-foreground">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our handmade collections and add something you love.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop collections
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl bg-card">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                    className="flex gap-4 overflow-hidden p-5 sm:gap-6"
                  >
                    <Link
                      to="/shop/$collectionId/$productId"
                      params={{
                        collectionId: item.categoryId,
                        productId: item.id.split("/").slice(1).join("/"),
                      }}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-28 sm:w-28"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        width={224}
                        height={224}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/shop/$collectionId/$productId"
                            params={{
                              collectionId: item.categoryId,
                              productId: item.id.split("/").slice(1).join("/"),
                            }}
                            className="font-display text-base text-foreground transition-colors hover:text-primary sm:text-lg"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className="relative grid w-9 place-items-center overflow-hidden"
                            aria-live="polite"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={item.quantity}
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                transition={{ duration: 0.15, ease: easeOut }}
                                className="text-center text-sm font-medium tabular-nums"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="font-semibold text-foreground tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/shop"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear cart
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl bg-card p-6">
              <h2 className="font-display text-xl text-foreground">Order Summary</h2>

              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total items</dt>
                  <dd className="text-foreground tabular-nums">{totalQuantity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground tabular-nums">{formatPrice(totalValue)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                <span className="font-display text-lg text-foreground">Total</span>
                <span className="font-display text-lg text-foreground tabular-nums">
                  {formatPrice(totalValue)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Prices shown are development placeholders.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
