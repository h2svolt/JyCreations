import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { checkAdminSession, login } from "@/lib/auth-actions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login | JY Creations" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: async () => {
    const { authenticated } = await checkAdminSession();
    if (authenticated) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) return;

    setSubmitting(true);
    try {
      await login({ data: password });
      await navigate({ to: "/admin" });
    } catch {
      toast.error("Incorrect password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl bg-card p-8">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl text-foreground">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to manage the product catalog.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
