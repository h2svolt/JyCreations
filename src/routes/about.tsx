import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/dec1.png";
import { Heart, Scissors, Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | JY Creations" },
      {
        name: "description",
        content:
          "Learn about JY Creations — a handmade boutique crafting dream catchers, accessories, and home accents with love.",
      },
      { property: "og:title", content: "About | JY Creations" },
      {
        property: "og:description",
        content: "Learn about JY Creations — handmade boutique crafts made with love.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="pb-20">
      <section className="bg-card/50 py-16">
        <Reveal className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Our Story
          </span>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
            Crafted with heart, designed for joy
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 to-gold/10 blur-2xl" />
            <img
              src={hero}
              alt="Handmade pieces by JY Creations"
              width={1440}
              height={900}
              className="relative rounded-[2rem] object-cover elegant-shadow"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              JY Creations was born from a love for beautiful, meaningful things. What started as a
              small hobby of making handmade gifts for friends and family grew into a curated
              collection of delicate crafts — each piece made slowly, carefully, and with intention.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              From dreamy wall hangings to everyday accessories, every item is designed to feel
              personal, elegant, and a little bit magical. We believe the smallest details can turn
              ordinary moments into something special.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Stagger className="grid gap-8 sm:grid-cols-3">
          <StaggerItem className="rounded-2xl bg-card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl text-foreground">Made with Love</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every item is handcrafted with attention to detail and care.
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-2xl bg-card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
              <Scissors className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl text-foreground">Handmade Quality</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We use quality materials and thoughtful designs built to last.
            </p>
          </StaggerItem>
          <StaggerItem className="rounded-2xl bg-card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl text-foreground">Unique & Personal</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Custom orders and personalized touches are always welcome.
            </p>
          </StaggerItem>
        </Stagger>
      </section>
    </main>
  );
}
