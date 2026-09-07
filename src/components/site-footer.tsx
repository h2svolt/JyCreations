import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Youtube } from "lucide-react";
import logo from "@/assets/jy-creations-logo.webp";
import { Reveal } from "@/components/motion";
import { collections } from "@/lib/collections";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M16.04 2.667C8.69 2.667 2.708 8.647 2.708 16c0 2.35.613 4.646 1.78 6.67L2.6 29.6l7.087-1.86A13.3 13.3 0 0 0 16.04 29.333h.006c7.35 0 13.333-5.98 13.333-13.333S23.397 2.667 16.04 2.667Zm0 24.267h-.004a10.93 10.93 0 0 1-5.575-1.527l-.4-.237-4.206 1.104 1.122-4.098-.26-.42A10.9 10.9 0 0 1 5.042 16c0-6.03 4.91-10.933 10.998-10.933 6.03 0 10.933 4.903 10.933 10.933s-4.903 10.934-10.933 10.934Zm5.995-8.197c-.328-.164-1.94-.958-2.24-1.067-.3-.11-.518-.164-.737.164-.218.328-.846 1.067-1.037 1.286-.191.218-.382.246-.71.082-.328-.164-1.385-.51-2.638-1.627-.975-.87-1.633-1.944-1.824-2.272-.191-.328-.02-.505.144-.668.148-.147.328-.383.492-.574.164-.191.218-.328.328-.547.109-.219.055-.41-.027-.574-.082-.164-.737-1.777-1.01-2.433-.266-.639-.537-.552-.737-.562-.19-.01-.41-.012-.628-.012-.219 0-.574.082-.874.41-.3.328-1.146 1.12-1.146 2.734 0 1.613 1.174 3.171 1.338 3.39.164.218 2.31 3.527 5.595 4.946.782.338 1.392.54 1.868.691.785.25 1.5.215 2.065.13.63-.094 1.94-.793 2.213-1.558.273-.765.273-1.422.191-1.558-.082-.137-.3-.219-.628-.383Z" />
    </svg>
  );
}

export function SiteFooter() {
  const shopLinks = collections.slice(0, 5);

  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="JY Creations home"
            >
              <img
                src={logo}
                alt="JY Creations"
                width={84}
                height={84}
                className="h-[72px] w-[72px] object-cover [clip-path:circle(48%_at_50%_50%)]"
              />
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
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-light/8 text-[#25D366] transition-all hover:bg-cream-light/15"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
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
