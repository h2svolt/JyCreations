import { createFileRoute } from "@tanstack/react-router";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import heroPrimary from "@/assets/Cover.webp";
import hero2 from "@/assets/hero2.png";
import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";
import storyPhotoMain from "@/assets/dec1.png";
import storyPhotoOne from "@/assets/dec2.png";
import storyPhotoTwo from "@/assets/dec3.png";
import whyChooseBg from "@/assets/hero_below.png";
import { collections } from "@/lib/collections";
import { getProducts, formatPrice } from "@/lib/products";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ArrowRight,
  Gift,
  Hand,
  Heart,
  Instagram,
  Leaf,
  Mail,
  Package,
  Sparkles,
  Star,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Reveal, Stagger, StaggerItem, staggerItemVariants } from "@/components/motion";
import { cn } from "@/lib/utils";
import { getCategoryTheme } from "@/lib/category-theme";
import { OrnamentDivider } from "@/components/ornament-divider";

// Drop more wide/atmospheric shots in here to widen the rotation — no other
// code changes needed.
const heroImages = [heroPrimary, hero2, hero3, hero4];
const HERO_ROTATE_INTERVAL_MS = 6000;

const movingStats = [
  { icon: Heart, label: "200+ Happy Customers" },
  { icon: Package, label: "350+ Orders Delivered" },
  { icon: Star, label: "4.9★ Average Rating" },
  { icon: Hand, label: "100% Handmade" },
  { icon: Award, label: "7+ Years of Craft" },
];

const trustBadges = [
  { icon: Heart, label: "Handmade with Love", color: "text-primary" },
  { icon: Sparkles, label: "Made with Premium Materials", color: "text-gold" },
  { icon: Gift, label: "Custom Orders Welcome", color: "text-forest" },
];

const whyChooseUs = [
  {
    icon: Sparkles,
    title: "Quality Materials",
    desc: "We use premium yarns and materials for long-lasting pieces.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    desc: "Sustainable choices for a better tomorrow.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    desc: "Every piece is handmade with love and attention to detail.",
  },
  {
    icon: Gift,
    title: "Perfect for Gifting",
    desc: "Beautifully packed and ready to make someone smile.",
  },
];

// Best sellers are drawn from real catalogue photos — one lead piece per
// collection that already has product images, so the carousel never shows a
// broken thumbnail.
const bestSellers = collections
  .map((collection) => getProducts(collection.id, collection.shortName)[0])
  .filter((product): product is NonNullable<typeof product> => Boolean(product));

const instagramShots = bestSellers.slice(0, 6);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JY Creations | Handmade with Love" },
      {
        name: "description",
        content:
          "Discover handmade dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers at JY Creations.",
      },
      { property: "og:title", content: "JY Creations | Handmade with Love" },
      {
        property: "og:description",
        content:
          "Discover handmade dream catchers, table mats, key chains, bookmarks, coasters, bracelets, wallets, and glasses covers at JY Creations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    // No backend is connected yet, so acknowledge on the client — same
    // pattern used by the contact form until a real subscription service exists.
    window.setTimeout(() => {
      toast.success("You're subscribed! We'll keep you posted.");
      setEmail("");
      setSubmitting(false);
    }, 400);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="w-full rounded-full border border-input bg-background px-5 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (heroImages.length < 2) return;
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, HERO_ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <main>
        {/* Hero */}
        <section
          ref={heroRef}
          className="relative flex min-h-[640px] items-center overflow-hidden bg-ink lg:min-h-screen"
        >
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <AnimatePresence>
              <motion.div
                key={heroIndex}
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </motion.div>
          {/* This darkening exists to keep the intro copy legible — so it eases
              off on the image-only slides where there's no text to protect. */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 via-40% to-ink/15"
            animate={{ opacity: heroIndex === 0 ? 1 : 0.25 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10"
            animate={{ opacity: heroIndex === 0 ? 1 : 0.5 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          <div className="animate-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="animate-float pointer-events-none absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl [animation-delay:3s]" />

          {/* Intro copy only belongs over the Cover shot — it vanishes while
              hero2/hero3/hero4 take their own turn, then re-enters when the
              rotation comes back around to Cover. */}
          <AnimatePresence>
            {heroIndex === 0 && (
              <motion.div
                key="hero-copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-28"
              >
                <Stagger className="max-w-sm space-y-7">
                  <StaggerItem className="flex items-center gap-3">
                    <span className="h-px w-10 bg-gold" />
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                      Handmade · Crafted with Love
                    </span>
                  </StaggerItem>
                  <motion.h1
                    variants={staggerItemVariants}
                    className="font-display text-5xl font-light leading-[1.05] text-cream-light sm:text-6xl lg:text-7xl"
                  >
                    Crafted by Hand,
                    <br />
                    Made with <em className="italic text-primary">Heart</em>
                  </motion.h1>
                  <motion.p
                    variants={staggerItemVariants}
                    className="max-w-lg text-lg leading-relaxed text-cream-light/70"
                  >
                    Every stitch tells a story. From our hands to yours, our handmade creations are
                    made with care, passion, and a whole lot of love.
                  </motion.p>
                  <StaggerItem className="flex flex-wrap gap-4 pt-2">
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                    >
                      Our Story
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </StaggerItem>
                </Stagger>
              </motion.div>
            )}
          </AnimatePresence>

          <svg
            className="absolute bottom-0 left-0 right-0 h-16 w-full text-background"
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M0,32 C120,64 240,0 360,16 C480,32 600,64 720,48 C840,32 960,0 1080,16 C1200,32 1320,64 1440,32 L1440,64 L0,64 Z"
            />
          </svg>
        </section>

        {/* Trust badges */}
        <section className="border-b border-border/40 py-8">
          <Stagger className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
            {trustBadges.map((badge) => (
              <StaggerItem key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className={cn("h-4 w-4", badge.color)} />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Stats ticker */}
        <section className="overflow-hidden border-b border-border/40 bg-primary py-3">
          <div className="flex w-max animate-marquee items-center gap-16">
            {[...movingStats, ...movingStats, ...movingStats, ...movingStats].map((stat, index) => (
              <div
                key={index}
                className="flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
              >
                <stat.icon className="h-4 w-4" />
                {stat.label}
              </div>
            ))}
          </div>
        </section>

        {/* Shop by Category */}
        <section id="categories" className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="mb-14 text-center">
              <span className="text-sm font-medium uppercase tracking-widest text-primary">
                Shop by Category
              </span>
              <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                Handmade for Every Little Joy
              </h2>
            </Reveal>

            <Stagger className="flex flex-wrap justify-center gap-x-8 gap-y-10">
              {collections.map((collection) => {
                const theme = getCategoryTheme(collection.id);
                return (
                  <StaggerItem key={collection.id} className="w-28 text-center sm:w-32">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/shop/$collectionId" params={{ collectionId: collection.id }}>
                        <div
                          className="mx-auto h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28"
                          style={{
                            boxShadow: `0 0 0 4px var(--card), 0 0 0 6px ${theme.accent}`,
                          }}
                        >
                          <img
                            src={collection.image}
                            alt={collection.name}
                            width={224}
                            height={224}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <h3 className="mt-3 text-sm font-medium text-foreground">
                          {collection.shortName}
                        </h3>
                        <span
                          className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium"
                          style={{ color: theme.accent }}
                        >
                          Explore
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <Reveal className="mt-14 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
              >
                View All Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        <OrnamentDivider className="py-10" />

        {/* Our Story */}
        <section className="bg-forest/8 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-primary">Our Story</span>
              </div>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Made with love, <em className="italic text-primary">just for you.</em>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                What started as a hobby is now a small dream come true. Every piece is handcrafted
                with care, using quality materials and lots of love. Thank you for supporting
                handmade!
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
              >
                Know More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal className="relative mx-auto h-80 w-full max-w-md sm:h-96">
              <img
                src={storyPhotoMain}
                alt="A collection of handmade JY Creations pieces"
                className="absolute left-0 top-4 h-56 w-44 rotate-[-6deg] rounded-xl border-4 border-card object-cover elegant-shadow sm:h-64 sm:w-52"
                loading="lazy"
              />
              <img
                src={storyPhotoOne}
                alt="Handmade coasters"
                className="absolute right-2 top-0 h-40 w-40 rotate-[8deg] rounded-xl border-4 border-card object-cover elegant-shadow sm:h-44 sm:w-44"
                loading="lazy"
              />
              <img
                src={storyPhotoTwo}
                alt="Handmade bracelets"
                className="absolute bottom-0 right-6 h-40 w-40 rotate-[4deg] rounded-xl border-4 border-card object-cover elegant-shadow sm:h-44 sm:w-44"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-0 grid h-20 w-20 place-items-center rounded-full bg-card text-center text-xs font-semibold leading-tight text-primary elegant-shadow">
                Handmade
                <br />
                with Love
              </div>
            </Reveal>
          </div>
        </section>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="bg-card/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <Reveal className="mb-12 text-center">
                <span className="text-sm font-medium uppercase tracking-widest text-primary">
                  Best Sellers
                </span>
                <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                  Loved by Many
                </h2>
              </Reveal>

              <Reveal>
                <Carousel opts={{ align: "start", loop: false }}>
                  <CarouselContent>
                    {bestSellers.map((product) => {
                      const theme = getCategoryTheme(product.categoryId);
                      const label = collections.find((c) => c.id === product.categoryId)?.shortName;
                      return (
                        <CarouselItem
                          key={product.id}
                          className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                        >
                          <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-border/40 transition-all hover:-translate-y-1 hover:elegant-shadow">
                            <Link
                              to="/shop/$collectionId/$productId"
                              params={{ collectionId: product.categoryId, productId: product.slug }}
                              className="relative block aspect-[3/4] overflow-hidden bg-secondary"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={400}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              {label && (
                                <span
                                  className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                                  style={{
                                    backgroundColor: theme.accent,
                                    color: theme.accentForeground,
                                  }}
                                >
                                  {label}
                                </span>
                              )}
                            </Link>
                            <div className="flex flex-1 items-end justify-between gap-2 p-4">
                              <div className="min-w-0">
                                <Link
                                  to="/shop/$collectionId/$productId"
                                  params={{
                                    collectionId: product.categoryId,
                                    productId: product.slug,
                                  }}
                                  className="block truncate text-sm font-medium text-foreground hover:text-primary"
                                >
                                  {product.name}
                                </Link>
                                <p className="mt-1 text-sm font-semibold text-primary">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <AddToCartButton product={product} iconOnly />
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <div className="mt-6 flex justify-center gap-3">
                    <CarouselPrevious className="static h-10 w-10 -translate-y-0" />
                    <CarouselNext className="static h-10 w-10 -translate-y-0" />
                  </div>
                </Carousel>
              </Reveal>

              <Reveal className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
                >
                  Shop All Best Sellers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        <section
          className="relative overflow-hidden bg-cover bg-center py-20"
          style={{ backgroundImage: `url(${whyChooseBg})` }}
        >
          <div className="absolute inset-0 bg-ink/85" />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="mb-14 max-w-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs uppercase tracking-[0.2em] text-gold">Why Choose Us</span>
              </div>
              <h2 className="font-display text-3xl font-light text-cream-light sm:text-4xl">
                Thoughtful in <em className="italic text-gold">Every Detail</em>
              </h2>
            </Reveal>

            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item) => (
                <StaggerItem
                  key={item.title}
                  className="group rounded-2xl border border-cream-light/10 bg-cream-light/5 p-6 text-center transition-all hover:border-gold/30 hover:bg-cream-light/[0.09]"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cream-light/10 text-gold">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-cream-light">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-light/55">{item.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 px-8 py-16 text-center md:px-16">
              <div className="animate-float absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
              <div className="animate-float absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl [animation-delay:3s]" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl text-primary-foreground md:text-4xl">
                  Looking for something custom?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-foreground/90">
                  We love creating personalized pieces for gifts, events, and special occasions.
                  Let’s bring your vision to life.
                </p>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-semibold text-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Instagram */}
        {instagramShots.length > 0 && (
          <section className="bg-card/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <Reveal className="mb-10 text-center">
                <span className="text-sm font-medium uppercase tracking-widest text-primary">
                  Follow Us @jycreations
                </span>
                <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                  Handmade Moments, Shared with You
                </h2>
              </Reveal>

              <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {instagramShots.map((product) => (
                  <StaggerItem
                    key={product.id}
                    className="group relative aspect-square overflow-hidden rounded-xl"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/50">
                      <Instagram className="h-6 w-6 text-cream-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal className="mt-10 text-center">
                <a
                  href="https://www.instagram.com/jycreations1?igsi=MTB4NmI0aGt3YXI1ag=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
                >
                  <Instagram className="h-4 w-4" />
                  Follow Us on Instagram
                </a>
              </Reveal>
            </div>
          </section>
        )}

        <OrnamentDivider className="py-10" />

        {/* Newsletter */}
        <section className="bg-burgundy/8 py-16">
          <Reveal className="mx-auto max-w-2xl px-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-card text-primary elegant-shadow">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-display text-2xl text-foreground sm:text-3xl">
              Be the first to know
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Get updates on new arrivals, special offers, and more handmade goodness!
            </p>
            <div className="mt-7">
              <NewsletterForm />
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
