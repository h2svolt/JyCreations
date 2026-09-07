import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Star, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import logo from "@/assets/jy-creations-logo.webp";
import { useCart } from "@/lib/cart";
import { getAllProducts } from "@/lib/products";
import { cn } from "@/lib/utils";
import { easeOut, staggerContainerVariants, staggerItemVariants } from "@/components/motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/", hash: "categories", label: "Collections" },
  { to: "/contact", label: "Custom Orders" },
  { to: "/about", label: "About" },
] as const;

function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? getAllProducts()
        .filter((p) => p.name.toLowerCase().includes(trimmed))
        .slice(0, 6)
    : [];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-full text-cream-light transition-colors hover:bg-cream-light/10"
        aria-label="Search products"
        aria-expanded={open}
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-card p-3 elegant-shadow ring-1 ring-border/40 sm:w-80"
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handmade pieces…"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
            />

            {trimmed && (
              <div className="mt-2 max-h-72 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No pieces match "{query.trim()}".
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          to="/shop/$collectionId/$productId"
                          params={{ collectionId: product.categoryId, productId: product.slug }}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary/60"
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <span className="truncate text-sm text-foreground">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalQuantity, hydrated, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300",
        scrolled ? "bg-ink/95 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.5)]" : "bg-ink/85",
      )}
    >
      <div className="flex items-center justify-center gap-1.5 border-b border-cream-light/10 bg-ink py-2 text-center text-xs font-medium tracking-wide text-primary">
        <Star className="h-3 w-3 fill-current" />
        Free Shipping on orders above Rs 5000
      </div>

      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-[padding] duration-300",
          scrolled ? "py-2" : "py-3",
        )}
      >
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-95"
          aria-label="JY Creations home"
        >
          <motion.span
            className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#ead9cf] shadow-[0_5px_16px_-10px_rgba(0,0,0,0.85)] ring-1 ring-cream-light/15 sm:h-12 sm:w-12"
            animate={scrolled ? { width: 40, height: 40 } : {}}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              className="h-full w-full scale-[1.06] object-cover"
            />
          </motion.span>

          <span className="hidden min-w-0 flex-col justify-center leading-none sm:flex">
            <span className="font-display text-[20px] tracking-[-0.02em] text-cream-light lg:text-[21px]">
              jycreations
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-cream-light/50">
              Handmade with love
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              {...("hash" in link ? { hash: link.hash } : {})}
              className="relative text-sm font-medium tracking-wide text-cream-light/80 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:text-gold hover:after:w-full"
              {...("hash" in link
                ? {}
                : {
                    activeProps: {
                      className:
                        "relative text-sm font-medium tracking-wide text-gold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-gold",
                    },
                    activeOptions: { exact: link.to === "/" },
                  })}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <HeaderSearch />

          <button
            type="button"
            onClick={() => toast("Accounts are coming soon — reach out via Custom Orders for now.")}
            className="grid h-10 w-10 place-items-center rounded-full text-cream-light transition-colors hover:bg-cream-light/10"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full text-cream-light transition-colors hover:bg-cream-light/10"
            aria-label={
              hydrated && totalQuantity > 0
                ? `Open cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`
                : "Open cart"
            }
          >
            <ShoppingBag className="h-5 w-5" />
            {/* Rendered only after hydration: the server has no localStorage,
                so painting a count during SSR would mismatch on the client. */}
            <AnimatePresence>
              {hydrated && totalQuantity > 0 && (
                <motion.span
                  key={totalQuantity}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-semibold leading-none text-ink tabular-nums"
                  aria-hidden="true"
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="grid h-10 w-10 place-items-center rounded-full text-cream-light transition-colors hover:bg-cream-light/10 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden border-t border-cream-light/10 bg-ink lg:hidden"
          >
            <motion.nav
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4 px-6 py-5"
            >
              {navLinks.map((link) => (
                <motion.div key={link.label} variants={staggerItemVariants}>
                  <Link
                    to={link.to}
                    {...("hash" in link ? { hash: link.hash } : {})}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-cream-light/80 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
