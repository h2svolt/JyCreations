import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, Landmark, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { buildWhatsAppLink, CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | JY Creations" },
      { name: "description", content: "Complete your JY Creations order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = "cod" | "bank";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";

function CheckoutPage() {
  const { items, hydrated, totalQuantity, totalValue, clear } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const buildOrderMessage = () => {
    const lines = items.map(
      (item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
    );
    return [
      `New order from ${fullName}`,
      "",
      ...lines,
      "",
      `Total: ${formatPrice(totalValue)}`,
      `Payment method: ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Bank Transfer"}`,
      "",
      `Phone: ${phone}`,
      `Address: ${address}, ${city}`,
      notes.trim() ? `Notes: ${notes}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast.error("Please fill in your name, phone, address, and city.");
      return;
    }

    setSubmitting(true);
    const orderMessage = buildOrderMessage();

    try {
      // No backend is connected — FormSubmit relays this straight to our inbox
      // without needing a server. The destination email confirms itself the
      // first time it receives a submission from a new site.
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone,
          email: email.trim() || "Not provided",
          city,
          address,
          payment_method: paymentMethod === "cod" ? "Cash on Delivery" : "Online Bank Transfer",
          notes: notes.trim() || "None",
          order_items: items
            .map(
              (item) =>
                `${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`,
            )
            .join("; "),
          order_total: formatPrice(totalValue),
          _subject: `New JY Creations order — ${fullName} (${formatPrice(totalValue)})`,
          _template: "table",
          ...(email.trim() ? { _replyto: email.trim() } : {}),
        }),
      });

      if (!response.ok) throw new Error(`FormSubmit responded with ${response.status}`);

      // WhatsApp has no free send-without-a-tap API — this opens the chat
      // with the order pre-filled so the customer only has to hit send.
      if (WHATSAPP_NUMBER) {
        window.open(buildWhatsAppLink(orderMessage), "_blank", "noopener,noreferrer");
      }

      clear();
      setPlaced(true);
    } catch {
      toast.error(
        "Something went wrong sending your order. Please try again, or reach us directly via WhatsApp or email.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-foreground">Order received!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thank you, {fullName}. We've emailed your order to our team
          {WHATSAPP_NUMBER
            ? " and opened WhatsApp so you can send us the details directly."
            : ". We'll reach out on WhatsApp or by phone shortly to confirm."}
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl text-foreground md:text-4xl">Checkout</h1>

      {!hydrated ? (
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-card" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-card px-6 py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-display text-xl text-foreground">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add something to your cart before checking out.
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12"
        >
          <div className="rounded-2xl bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl text-foreground">Shipping Details</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[2fr_1fr]">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground">
                  Delivery address
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, street, area"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-foreground">
                Order notes <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions?"
                className={inputClass}
              />
            </div>

            <h2 className="mt-10 font-display text-xl text-foreground">Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="mt-5 grid gap-3"
            >
              <label
                htmlFor="pm-cod"
                className="flex cursor-pointer items-start gap-4 rounded-xl border border-input p-4 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/50"
              >
                <RadioGroupItem value="cod" id="pm-cod" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Cash on Delivery</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay in cash when your order arrives at your doorstep.
                  </p>
                </div>
              </label>

              <label
                htmlFor="pm-bank"
                className="flex cursor-pointer items-start gap-4 rounded-xl border border-input p-4 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/50"
              >
                <RadioGroupItem value="bank" id="pm-bank" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Online Bank Transfer
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Transfer the order total to our bank account before dispatch.
                  </p>
                  {paymentMethod === "bank" && (
                    // TODO: replace with the real bank name, account title, and
                    // account number/IBAN once they're provided.
                    <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                      We'll send our bank account details on WhatsApp/email right after you place
                      this order.
                    </p>
                  )}
                </div>
              </label>
            </RadioGroup>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl bg-card p-6">
              <h2 className="font-display text-xl text-foreground">Order Summary</h2>

              <ul className="mt-5 flex flex-col gap-3 border-b border-border/60 pb-5 text-sm">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <span className="shrink-0 font-medium text-foreground tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total items</dt>
                  <dd className="text-foreground tabular-nums">{totalQuantity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-muted-foreground">Calculated on confirmation</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                <span className="font-display text-lg text-foreground">Total</span>
                <span className="font-display text-lg text-foreground tabular-nums">
                  {formatPrice(totalValue)}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing order…" : "Place Order"}
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                By placing this order you agree to be contacted to confirm delivery details.
              </p>
            </div>
          </aside>
        </form>
      )}
    </main>
  );
}
