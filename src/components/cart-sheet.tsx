import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { easeOut } from "@/components/motion";

export function CartSheet() {
  const {
    items,
    isOpen,
    setOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    totalQuantity,
    totalValue,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-6 py-5">
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
          <SheetDescription>
            {totalQuantity === 0
              ? "Your cart is empty."
              : `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nothing here yet. Explore our handmade collections to get started.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse collections
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="flex flex-col gap-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                      className="flex gap-4 overflow-hidden"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={160}
                          height={160}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              onClick={() => decrement(item.id)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span
                              className="relative grid w-8 place-items-center overflow-hidden"
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
                              className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-foreground tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <SheetFooter className="gap-3 border-t border-border/60 px-6 py-5">
              <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                <span>Total items</span>
                <span className="tabular-nums">{totalQuantity}</span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-lg text-foreground">Total</span>
                <span className="font-display text-lg text-foreground tabular-nums">
                  {formatPrice(totalValue)}
                </span>
              </div>
              <Link
                to="/cart"
                onClick={closeCart}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View full cart
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
