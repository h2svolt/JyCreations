import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, MessageCircle, Youtube } from "lucide-react";
import logo from "@/assets/jy-creations-logo.webp";
import { Reveal } from "@/components/motion";
import { collections } from "@/lib/collections";

export function SiteFooter() {
  const shopLinks = collections.slice(0, 5);

  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="JY Creations" width={140} height={56} className="h-14 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-cream-light/50">
              Handmade with love. Each piece is crafted to bring a little more beauty and joy into
              your everyday life.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/jycreations1?igsi=MTB4NmI0aGt3YXI1ag=="
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" color="#E1306C" />
              </a>
              <a
                href="https://www.facebook.com/share/19YSx35aDS/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" color="#1877F2" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=jycreations2@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" color="#EA4335" />
              </a>
              {/* TODO: replace with the real wa.me/<number> link once it's provided. */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" color="#25D366" />
              </a>
              <a
                href="https://youtube.com/@jycreations976?si=fo1n5z6KrDvt0pAl"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" color="#FF0000" />
              </a>
              <a
                href="https://www.tiktok.com/@jycreations1?_r=1&_t=ZS-99XPr0rWQlw"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 transition-all hover:bg-cream-light/15"
                aria-label="TikTok"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  color="#ffffff"
                  aria-hidden="true"
                >
                  <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.62h-3.14v13.9c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .58.05.85.13V10.2a6.06 6.06 0 0 0-.85-.06 6.08 6.08 0 1 0 6.08 6.08V9.4a9.15 9.15 0 0 0 5.3 1.7V8a5.85 5.85 0 0 1-3.94-2.18z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream-light">Shop</h4>
            <nav className="flex flex-col gap-2.5">
              {shopLinks.map((collection) => (
                <Link
                  key={collection.id}
                  to="/shop/$collectionId"
                  params={{ collectionId: collection.id }}
                  className="text-sm text-cream-light/45 transition-colors hover:text-gold"
                >
                  {collection.shortName}
                </Link>
              ))}
              <Link
                to="/shop"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                View all collections
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream-light">Company</h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                Contact
              </Link>
              <Link
                to="/policies/shipping-policy"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                Shipping Policy
              </Link>
              <Link
                to="/cart"
                className="text-sm text-cream-light/45 transition-colors hover:text-gold"
              >
                Your Cart
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream-light">Get in Touch</h4>
            <p className="text-sm leading-relaxed text-cream-light/45">
              Have a question or want a custom order? We'd love to hear from you.
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=jycreations2@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-gold hover:underline"
            >
              jycreations2@gmail.com
            </a>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream-light/10 pt-8 text-xs text-cream-light/35 sm:flex-row">
          <span>© {new Date().getFullYear()} JY Creations. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span>Handmade with love.</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.h2svolt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              Powered By H2S Volt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
