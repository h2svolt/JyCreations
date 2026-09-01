import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | JY Creations" },
      {
        name: "description",
        content: "Get in touch with JY Creations for custom orders, questions, or collaborations.",
      },
      { property: "og:title", content: "Contact | JY Creations" },
      {
        property: "og:description",
        content: "Get in touch with JY Creations for custom orders and questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // No backend is connected yet, so validate on the client and
    // acknowledge with a toast so the button is not silently dead.
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    // Simulated latency — swap for a real fetch once the backend exists.
    window.setTimeout(() => {
      toast.success("Message sent — we'll be in touch soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 400);
  };

  return (
    <main className="pb-20">
      <section className="bg-card/50 py-16">
        <Reveal className="mx-auto max-w-7xl px-6 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Get in Touch
          </span>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
            We’d love to hear from you
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have a question about a product, want a custom order, or just want to say hello? Send us
            a message and we’ll reply as soon as we can.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-card p-8 elegant-shadow"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your request..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                animate={{ opacity: submitting ? 0.7 : 1, scale: submitting ? 0.99 : 1 }}
                transition={{ duration: 0.2 }}
                className="mt-8 w-full rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Message"}
              </motion.button>
            </form>
          </Reveal>

          <Stagger className="space-y-6">
            <StaggerItem className="rounded-2xl bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground">Email</h3>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=jycreations2@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    jycreations2@gmail.com
                  </a>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="rounded-2xl bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground">Phone</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Available on request</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="rounded-2xl bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground">Studio</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Handmade with love, shipped worldwide.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>
    </main>
  );
}
