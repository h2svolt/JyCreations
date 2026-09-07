import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, PackageSearch, RotateCcw, Truck, Zap } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/policies/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy | JY Creations" },
      {
        name: "description",
        content: "Delivery options, timeframes, and shipping costs for JY Creations orders.",
      },
      { property: "og:title", content: "Shipping Policy | JY Creations" },
      {
        property: "og:description",
        content: "Delivery options, timeframes, and shipping costs for JY Creations orders.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/policies/shipping-policy` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/shipping-policy` }],
  }),
  component: ShippingPolicyPage,
});

const deliveryOptions = [
  {
    icon: Truck,
    title: "Standard Delivery",
    timeframe: "7 working days",
    detail:
      "Saturdays and Sundays are non-working days. A Rs. 270 advance payment is required before we begin handcrafting your order; the balance is paid via Cash on Delivery.",
  },
  {
    icon: Zap,
    title: "Urgent Delivery",
    timeframe: "1–2 days prep + 2–3 days shipping",
    detail:
      "A Rs. 500 preparation fee plus Rs. 270 delivery charges apply, with full payment for the item(s) required upfront.",
  },
  {
    icon: Clock,
    title: "Express Courier",
    timeframe: "At your doorstep in 3 days",
    detail:
      "Full upfront payment is required for the item(s). Courier charges vary by location and package size and are paid directly to the courier.",
  },
];

function ShippingPolicyPage() {
  return (
    <main className="pb-20">
      <section className="bg-card/50 py-16">
        <Reveal className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Delivery Info
          </span>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
            Shipping Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Every piece is handmade to order — here's how delivery works, from crafting to your
            doorstep.
          </p>
        </Reveal>
      </section>

      {/* Costs and timeframes below are carried over from a reference brand in the same
            handmade-crochet space and should be replaced with JY Creations' own numbers once
            finalized — same placeholder convention as DEFAULT_PRICE in src/lib/products.ts. */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Stagger className="grid gap-6 sm:grid-cols-3">
          {deliveryOptions.map((option) => (
            <StaggerItem key={option.title} className="rounded-2xl bg-card p-8 elegant-shadow">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                <option.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl text-foreground">{option.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{option.timeframe}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{option.detail}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <Reveal className="rounded-2xl bg-card p-8 elegant-shadow sm:p-10">
          <h2 className="font-display text-2xl text-foreground">Shipping Cost & Coverage</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            We ship nationwide across Pakistan for a flat rate of Rs. 270. Orders typically arrive
            within 2–3 business days of dispatch.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <Stagger className="grid gap-6 md:grid-cols-2">
          <StaggerItem className="rounded-2xl bg-card p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Address Verification</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Please double-check your shipping address at checkout — we can't be held
                  responsible for delays or misdelivery caused by an incorrect address.
                </p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="rounded-2xl bg-card p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <PackageSearch className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Tracking</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Once your order ships, we'll email tracking details when available so you can
                  follow its journey.
                </p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="rounded-2xl bg-card p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Lost Packages</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  If a package seems delayed or missing, please check with neighbors first. If the
                  issue continues, reach out and we'll help sort it out.
                </p>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem className="rounded-2xl bg-card p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">Returns & Exchanges</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Since every item is handmade to order, we don't accept returns or exchanges unless
                  there's a defect or an error on our part.
                </p>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center elegant-shadow">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl text-foreground">Questions about your order?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Reach out and we'll get back to you as soon as we can.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=jycreations2@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            jycreations2@gmail.com
          </a>
        </Reveal>
      </section>
    </main>
  );
}
